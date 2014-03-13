package db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

import parser.Article;
import parser.Tweet;

public class DBManager 
{
    public Connection getConnection() 
    {
        Connection conn = null;
        int cnt = 6;
        while (conn == null && cnt > 0)
        {
            try {
//                Class.forName("org.postgresql.Driver");
//                conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/postgres", "appUser", "bla");
                Class.forName("com.mysql.jdbc.Driver");
                conn = DriverManager.getConnection("jdbc:mysql://localhost/nrg4cast?" +
                                                    "user=appUser&password=blabla-ailab");
                System.out.println("(NewsfeedNewsRetrieval) creating new connection...");
            } 
            catch (SQLException e) 
            {
                e.printStackTrace();
            } 
            catch (ClassNotFoundException e) 
            {
                e.printStackTrace();
            }
            cnt--;
        }
        return conn;
    }
    public boolean saveArticleToDB(Article article, Connection conn)
    {
        if ((article.getLocations() != null && !article.getLocations().isEmpty() && (article.getLocations().contains("Turin") || article.getLocation().contains("Torino")))
                || (article.getLatitude() != 0 && article.getLongitude() != 0 && article.getLatitude()<45.3 && article.getLatitude() > 44.8 && article.getLongitude()<8 && article.getLongitude()>7.3)) //Torino: 44.900000,7.400000;45.200000,7.900000
        {
            //set torino long and lat = 45.0667 N, 7.7 E
            if (article.getLatitude() == 0 || article.getLatitude() < 44.9 || article.getLatitude() > 45.2)
            {
                article.setLatitude(45.0667);
                article.setLongitude(0);
            }
            if (article.getLongitude() == 0)
            {
                article.setLongitude(7.7);
            }

            insertArticle(article, conn);
            return true;
        }
        else if ((article.getLatitude() == 0 && article.getLocations() != null && !article.getLocations().isEmpty() && (article.getLocations().contains("Athens")))
                || (article.getLatitude() != 0 && article.getLongitude() != 0 && article.getLatitude()<38.2 && article.getLatitude() > 37.8 && article.getLongitude()<24 && article.getLongitude()>23.5)) //Athens: 37.9,23.6;38.1,23.9
        {
            //set athens long and lat 37.9667 N, 23.7167 E
            if (article.getLatitude() == 0 || article.getLatitude() < 37.9 || article.getLatitude() > 38.1)
            {
                article.setLatitude(37.9667);
                article.setLongitude(0);
            }
            if (article.getLongitude() == 0)
            {
                article.setLongitude(23.7167);
            }

            insertArticle(article, conn);
            return true;
        }
        else if ((article.getLatitude() == 0 && article.getLocations() != null && !article.getLocations().isEmpty() && (article.getLocations().contains("Germany") || article.getLocations().contains("Deutschland")))
                || (article.getLatitude() != 0 && article.getLongitude() != 0 && article.getLatitude()<54.9 && article.getLatitude() > 47.9 && article.getLongitude()<14.1 && article.getLongitude()>6.9)) //Germany: 48.0,7.0;54.0,14.0
        {
            //set germany long and lat 51.5167 N, 9.9167 E
            if (article.getLatitude() == 0 || article.getLatitude() < 48 || article.getLatitude() > 54)
            {
                article.setLatitude(51.5167);
                article.setLongitude(0);
            }
            if (article.getLongitude() == 0)
            {
                article.setLongitude(9.9167);
            }

            insertArticle(article, conn);
            return true;
        }
//        else
//        {
//            System.out.println(article.getLongitude()+"," + article.getLatitude()+" - " + article.getTitle());
//        }
        return false;
    }
    private void insertArticle(Article a, Connection conn)
    {
        try
        {
            Timestamp date = new Timestamp(a.getDate().getTime());
            String text = (a.getText().length() > 8000) ? (a.getText().substring(0, 7990) + "...") : a.getText();
            String articleSql = "INSERT INTO NEWS (title,publish_date, locations_str,longitude,latitude,text) VALUES (?,?,?,?,?,?)"; // RETURNING id"; //->postgres
            PreparedStatement insertArticle = conn.prepareStatement(articleSql);
            insertArticle.setString(1, a.getTitle());
            insertArticle.setTimestamp(2, date);
            insertArticle.setString(3, a.getLocations());
            insertArticle.setDouble(4, a.getLongitude());
            insertArticle.setDouble(5, a.getLatitude());
            insertArticle.setString(6, text);
            insertArticle.execute();
//            ResultSet sourceIds = insertArticle.getResultSet();
//            int sourceId = 0;
//            while(sourceIds.next())
//            {
//                sourceId = sourceIds.getInt(1);
//            }
            insertArticle.close();
//            System.out.println(sourceId);
//            System.out.println("Article inserted: " + a.getTitle());
        }
        catch (SQLException e) 
        {
            e.printStackTrace();
        }
    }
    
    public void saveTweetToDB(Tweet tweet, Connection conn)
    {
        try
        {
            String articleSql = "INSERT INTO TWEETS (text, user,longitude,latitude,date) VALUES (?,?,?,?,?)"; // RETURNING id"; //->postgres
            PreparedStatement insertArticle = conn.prepareStatement(articleSql);
            insertArticle.setString(1, tweet.getText());
            insertArticle.setString(2, tweet.getUser());
            insertArticle.setDouble(3, tweet.getLong());
            insertArticle.setDouble(4, tweet.getLat());
            insertArticle.setTimestamp(5, new Timestamp(tweet.getDate().getTime()));
            insertArticle.execute();
            insertArticle.close();
        }
        catch (SQLException e) 
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
