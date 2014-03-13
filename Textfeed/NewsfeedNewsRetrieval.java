
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Connection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.zip.GZIPInputStream;

import org.apache.commons.codec.binary.Base64;

import db.DBManager;
import parser.Article;
import parser.FileParser;


public class NewsfeedNewsRetrieval implements Runnable
{
    private static final int BUFFER_SIZE = 4096;
    private static String m_lastFileName;
    
    public static void main(String[] args) 
    {     
        (new Thread(new NewsfeedNewsRetrieval())).start();
        (new Thread(new TwiterRetrieval())).start();
    }
    
    public void run()
    {
        boolean firstRun = true;
        String date = null;
        Connection conn = null;
        DBManager db = new DBManager();
        conn = db.getConnection();
        
        while(true)
        {
            date = connectToNewsfeed(firstRun, date);
            try {
                String xmlFile = unzipGZfiles();
                System.out.println("Connection to newsfeed finished.");
                FileParser fileParser = new FileParser(xmlFile);
                ArrayList<Article> articles = fileParser.parseFile();
                if (conn == null)
                {
                    throw new Exception("No connection - cannot save articles!");
                }
                else
                {
                    File fileXml = new File(xmlFile);
                    fileXml.delete();
                }
                int cnt =0;
                for (Article a : articles)
                {
                    if (db.saveArticleToDB(a, conn))
                    {
                        cnt++;
                    }
                }
                System.out.println(cnt + " articles saved");
            } 
            catch (IOException e1) 
            {
                e1.printStackTrace();
            } 
            catch (Exception e) 
            {
                e.printStackTrace();
            } 
            firstRun = false;
            try {
                Thread.sleep(120000);
            } 
            catch (InterruptedException e) 
            {
                e.printStackTrace();
            }
        }
    }
    
    private static String connectToNewsfeed(boolean firstRun, String date)
    {
        try {
            String webPage;
            if (firstRun || (date == null))
            {
                webPage= "http://newsfeed.ijs.si/stream/";
            }
            else
            {
                webPage = "http://newsfeed.ijs.si/stream/?after=" + date; //?after=2013-12-31T0:00:00Z";
            }
            String name = "jasna";
            String password = "rendernews";

            String authString = name + ":" + password;
            byte[] authEncBytes = Base64.encodeBase64(authString.getBytes());
            String authStringEnc = new String(authEncBytes);
            //            System.out.println("Base64 encoded auth string: " + authStringEnc);

            //last access date (to Newsfeed)
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd h:mm:ss");
            String newDate = df.format(Calendar.getInstance().getTime()).toString();
            newDate = newDate.replace(' ', 'T');
            newDate = newDate + "Z";
            
            URL url = new URL(webPage);
            URLConnection urlConnection = url.openConnection();
            urlConnection.setRequestProperty("Authorization", "Basic " + authStringEnc);

            if (urlConnection.getContentLength() < 0) //if content is a file, lenght is -1
            {

                if (date == null)
                {
                    m_lastFileName = "a_" + (Calendar.getInstance().getTime().toString()).replace(' ', '_').replace(':', '_')+ ".gz";
                }
                else
                {
                    m_lastFileName = date.replace(':', '_') + ".gz";
                }
                
                File bla = new File(m_lastFileName);
                bla.setWritable(true);
                bla.createNewFile();
                InputStream inputStream = urlConnection.getInputStream();
                FileOutputStream outputStream = new FileOutputStream(bla);

                byte[] buffer = new byte[BUFFER_SIZE];
                int bytesRead = -1;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }

                outputStream.close();
                inputStream.close();

                return newDate;
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    private String unzipGZfiles() throws IOException
    {
     // open the input (compressed) file.
        FileInputStream stream = new FileInputStream(m_lastFileName);
        FileOutputStream output = null;
        try
        {
            // open the gziped file to decompress.
            GZIPInputStream gzipstream = new GZIPInputStream(stream);
            byte[] buffer = new byte[2048];
 
            // create the output file without the .gz extension.
            String outname = m_lastFileName.substring(0, m_lastFileName.length()-3) + ".xml";
            output = new FileOutputStream(outname);
 
            // and copy it to a new file
            int len;
            while((len = gzipstream.read(buffer ))>0)
            {
                output.write(buffer, 0, len);
            }
            
            return outname;
        }
        finally
        {
            // both streams must always be closed.
            if(output != null) output.close();
            stream.close();
            File fileGz = new File(m_lastFileName);
            fileGz.delete();
        }
    }
    
//    private void processGzip(URL url, byte[] response) throws MalformedURLException, IOException 
//    {
//
////            if (DEBUG) System.out.println("Processing gzip");
//
//            InputStream is = new ByteArrayInputStream(response);
//
//            // Remove .gz ending
//            String xmlUrl = url.toString().replaceFirst("\\.gz$", "");
//
////            if (DEBUG) System.out.println("XML url = " + xmlUrl);
//
//            InputStream decompressed = new GZIPInputStream(is);
//            InputSource in = new InputSource(decompressed);
//            in.setSystemId(xmlUrl);         
////            processXml(url, in);
//            decompressed.close();
//    }    
}
