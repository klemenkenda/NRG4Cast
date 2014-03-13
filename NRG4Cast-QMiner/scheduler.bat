:loop
  :: sleep two hours and one day
  ping -n 2 127.0.0.1 >nul
  :: qm stop
  curl http://localhost:9889/gs_gc
goto loop