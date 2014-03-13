package parser;

import java.util.ArrayList;
import java.util.Date;

public class Article 
{
    private int m_id;
    private ArrayList<String> m_location;
    private double m_longitude;
    private double m_latitude;
    private Date m_date;
    private String m_title;
    private String m_text;
    
    public Article(int id, ArrayList<String> location, double longitude, double latitude, Date date, String title)
    {
        m_id = id;
        m_location = new ArrayList<>();
        m_location.addAll(location);
        m_longitude = longitude;
        m_latitude = latitude;
        m_date = date;
        m_title = title;
    }
    
    public void setText(String t)
    {
        m_text = t;   
    }
    
    public void setLongitude(double l)
    {
        m_longitude = l;
    }
    
    public void setLatitude(double l)
    {
        m_latitude = l;
    }
    
    public int getId()
    {
        return m_id;
    }
    
    public String getTitle()
    {
        return m_title;
    }
    
    public Date getDate()
    {
        return m_date;
    }
    
    public String getLocations()
    {
        String locs = new String();
        for (String l :m_location)
        {
            locs = locs + "," + l;
        }
        locs = (locs!= null && !locs.isEmpty()) ? locs.substring(1) : null;
        return locs;
    }
    
    public ArrayList<String> getLocation()
    {
        return m_location;
    }
    
    public double getLongitude()
    {
        return m_longitude;
    }
    
    public double getLatitude()
    {
        return m_latitude;
    }
    
    public String getText()
    {
        return m_text;
    }
}
