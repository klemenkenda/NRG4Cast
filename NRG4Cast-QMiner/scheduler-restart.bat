:loop
  :: sleep two hours and one day
  ping -n 120000 127.0.0.1 >nul
  qm stop  
goto loop