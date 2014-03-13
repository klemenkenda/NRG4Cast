package parser;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;


public class FileParser 
{
    private String m_fileName;
    
    public FileParser(String fileName)
    {
        m_fileName = fileName;
    }
    
    public ArrayList<Article> parseFile() 
    {
        ArrayList<Article> articlesList = new ArrayList<>();
        DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
        try {
            DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
            Document doc = docBuilder.parse(new File(m_fileName));

            NodeList articles = doc.getElementsByTagName("article");

            for(int i =0; i < articles.getLength(); i++)
            {
                Element article = (Element) articles.item(i);
                int id = Integer.parseInt(article.getAttribute("id").trim());
                NodeList children = article.getChildNodes();
                String title = null;
                Date date = new Date();
                String text = null;
                ArrayList<String> locations = new ArrayList<>();
                double longitude = 0;
                double latitude = 0;

                for (int j=0; j<children.getLength();j++)
                {                    
                    if(children.item(j).getNodeName().equals("title"))
                    {
                        //get article's title
                        title = (children.item(j).getFirstChild() != null) ? children.item(j).getFirstChild().getNodeValue() : "";
                    }
                    else if (children.item(j).getNodeName().equals("retrieved-date"))
                    {
                        DateFormat df = new SimpleDateFormat("yyyy-MM-dd H:mm:ss");
                        date = df.parse(children.item(j).getTextContent().substring(0, children.item(j).getTextContent().indexOf('T')) + " " + 
                                children.item(j).getTextContent().substring(children.item(j).getTextContent().indexOf('T')+1, children.item(j).getTextContent().indexOf('Z')));
                    }
                    else if(children.item(j).getNodeName().equals("body-cleartext"))
                    {
                        //get article's text
                        text =  children.item(j).getTextContent();
                    }
                    else if(children.item(j).getNodeName().equals("body-rych"))
                    {
                        //get a list of all add-on by enrycher
                        //get all locations connected to the article
                        NodeList enrycherList = children.item(j).getChildNodes();

                        for(int k=0; k<enrycherList.getLength();k++)
                        {
                            if(enrycherList.item(k).getNodeName().equals("item"))
                            {
                                NodeList itemChildren = enrycherList.item(k).getChildNodes();
                                for(int l=0; l<itemChildren.getLength();l++)
                                {
                                    if(itemChildren.item(l).getNodeName().equals("annotations"))
                                    {
                                        NodeList annotations = itemChildren.item(l).getChildNodes();
                                        for(int m=0;m<annotations.getLength();m++)
                                        {
                                            if(annotations.item(m).getNodeName().equals("annotation") && ((Element)annotations.item(m)).getAttribute("type").equals("enrycher:location"))
                                            {
                                                locations.add(((Element)annotations.item(m)).getAttribute("displayName"));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (children.item(j).getNodeName().equals("location"))
                    {
                        NodeList locsList = children.item(j).getChildNodes();
                        for (int k=0;k<locsList.getLength();k++)
                        {
                            if (locsList.item(k).getNodeName().equals("latitude"))
                            {
                                latitude = Double.parseDouble(locsList.item(k).getTextContent().trim());   
                            }
                            else if (locsList.item(k).getNodeName().equals("longitude"))
                            {
                                longitude = Double.parseDouble(locsList.item(k).getTextContent().trim());
                            }
                        }
                    }
                    else if (children.item(j).getNodeName().equals("source"))
                    {
                        NodeList sourceList = children.item(j).getChildNodes();
                        for (int k=0;k<sourceList.getLength();k++)
                        {
                            if (sourceList.item(k).getNodeName().equals("location"))
                            {
                                NodeList locsList = sourceList.item(k).getChildNodes();
                                for (int l=0;l<locsList.getLength();l++)
                                {
                                    if (locsList.item(l).getNodeName().equals("latitude"))
                                    {
                                        latitude = Double.parseDouble(locsList.item(l).getTextContent().trim());   
                                    }
                                    else if (locsList.item(l).getNodeName().equals("longitude"))
                                    {
                                        longitude = Double.parseDouble(locsList.item(l).getTextContent().trim());
                                    }
                                }
                            }
                        }
                    }
                }
                Article a = new Article(id, locations, longitude, latitude, date, title);
                a.setText(text);
                articlesList.add(a);
            }
        } 
        catch (ParserConfigurationException e) 
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } 
        catch (SAXException e) 
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } 
        catch (IOException e) 
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (DOMException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        return articlesList;
    }
}
