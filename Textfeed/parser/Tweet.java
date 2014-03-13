package parser;

import java.util.Date;

public class Tweet 
{
    private String m_text;
    private String m_user;
    private double m_longitude;
    private double m_latitude;
    private Date m_date;
    
    public Tweet(String text, String user, double longitude, double latitude, Date date)
    {
        m_text = text;
        m_user = user;
        m_longitude = longitude;
        m_latitude = latitude;
        m_date = date;
    }
    
    public String getText()
    {
        return m_text;
    }
    public String getUser()
    {
        return m_user;
    }
    public double getLong()
    {
        return m_longitude;
    }
    public double getLat()
    {
        return m_latitude;
    }
    public Date getDate()
    {
        return m_date;
    }
}
