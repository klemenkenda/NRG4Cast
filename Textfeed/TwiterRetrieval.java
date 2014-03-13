import java.io.BufferedReader;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.sql.Connection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import db.DBManager;
import parser.Tweet;
import parser.TwiterParser;


public class TwiterRetrieval implements Runnable
{
    @Override
    public void run() 
    {
       String folderName = "D:/Users/jasna/tweets";
       
       while(true)
       {
           ArrayList<Tweet> tweets = new ArrayList<>();
           parseFiles(folderName, tweets);   
           DBManager db = new DBManager();
           Connection conn = db.getConnection();
           int cnt =0;
           for (Tweet t : tweets)
           {
               db.saveTweetToDB(t, conn);
               cnt++;
           }
           System.out.println(cnt + " tweets saved to DB.");
           try {
               Thread.sleep(120000);
           } 
           catch (InterruptedException e) 
           {
               e.printStackTrace();
           }
       }
    }

    private void parseFiles(String folderName, ArrayList<Tweet> tweets)
    {
        
        File folder = new File(folderName);
        TwiterParser tp = new TwiterParser();
        if (folder.isDirectory())
        {
            File[] zipFiles = folder.listFiles(
                    new FilenameFilter() {
                        public boolean accept(final File a_directory,
                                              final String a_name)
                        {
                            return a_name.endsWith(".zip");
                        };
                    });
            
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd H:mm:ss");
            Calendar cal = Calendar.getInstance();
            Date currentDate = cal.getTime();
            String newDate = df.format(currentDate).toString();
            newDate = newDate.replace(" ", "-");
            newDate = newDate.replace(":", "-");
            
            for (File x : zipFiles)
            {
                int mins = Integer.parseInt(x.getName().substring(14, 16));
                if (x.getName().startsWith(newDate.substring(0, 14)) && mins > (cal.get(Calendar.MINUTE)-10))
                {
                    System.out.println(x.getName());
                    continue;
                }

                try
                {
                    ZipFile zip = new ZipFile(x);
                    for (@SuppressWarnings("rawtypes")
                    Enumeration e = zip.entries(); e.hasMoreElements(); ) {
                        ZipEntry entry = (ZipEntry) e.nextElement();
                        
                        if (!entry.isDirectory())
                        {
                            InputStream is = zip.getInputStream(entry);
                            Reader r = new InputStreamReader(is);
                            BufferedReader buffered = new BufferedReader(r);
                            String line;
                            while ((line = buffered.readLine()) != null)
                            {                                
                                Tweet t = tp.parseTweet(line);
                                if (t != null)
                                {
                                    tweets.add(t);
                                }
                            }
                        }
                    }
                    zip.close();
//                    x.renameTo(new File(x.getAbsolutePath() + ".a.zip"));
                    x.delete();
                }catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }
    }
}
