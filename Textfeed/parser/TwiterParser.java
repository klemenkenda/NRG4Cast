package parser;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class TwiterParser 
{
    public Tweet parseTweet(String tweet)
    {
        //find coordinates
        double latitude = 0;
        double longitude = 0;
        String geo = tweet.substring(tweet.indexOf("\"geo\"") + 6);
        if(geo.startsWith("null"))
        {
            //find alternative coordinates (from boundingbox)
            String coordinates = tweet.substring(tweet.indexOf("\"bounding_box\""));
            coordinates = coordinates.substring(coordinates.indexOf("\"coordinates\""));
            coordinates = coordinates.substring(0, coordinates.indexOf('}'));
            coordinates = coordinates.substring(coordinates.indexOf('[')+3, coordinates.lastIndexOf(']')-1);
            
            latitude = Double.parseDouble(coordinates.substring(0,coordinates.indexOf(',')));
            longitude = Double.parseDouble(coordinates.substring(coordinates.indexOf(',')+1, coordinates.indexOf(']')));
            coordinates = coordinates.substring(coordinates.indexOf('['));
            coordinates = coordinates.substring(coordinates.indexOf(',')+1);
            longitude += Double.parseDouble(coordinates.substring(0, coordinates.indexOf(']')));
            longitude = longitude/2;
            coordinates = coordinates.substring(coordinates.indexOf('[')+1);
            latitude += Double.parseDouble(coordinates.substring(0,coordinates.indexOf(',')));
            latitude = latitude/2;
        }
        else
        {
            geo = geo.substring(geo.indexOf('[')+1, geo.indexOf(']'));
           try
           {
            longitude = Double.parseDouble(geo.substring(0, geo.indexOf(',')));
            latitude = Double.parseDouble(geo.substring(geo.indexOf(',')+1));
           }
           catch (Exception e)
           {
               return null;
           }
        }
        
        //find name/screen_name
        String name = tweet.substring(tweet.indexOf("\"screen_name\"")+15);
        name = name.substring(0, name.indexOf('\"'));
        
        //find text
        String text = tweet.substring(tweet.indexOf("\"text\"")+8);
        text = text.substring(0, text.indexOf("\",\"geo"));
        
        //find date
        String date = tweet.substring(tweet.indexOf("\"created_at\"")+14);
        Date d = null;
        date = date.substring(0, date.indexOf('\"'));
        date = date.trim();
        try 
        {
            d = new SimpleDateFormat("EEE MMM dd HH:mm:ss Z yyyy", Locale.ENGLISH).parse(date);
            
        } 
        catch (ParseException e) 
        {
            e.printStackTrace();
        }
        
        return new Tweet(text, name, latitude, longitude, d);
    }
}
