:loop
  :: Needs to be restarted twice due to unsulved aggregate save in QMiner
  qm start -conf=qm.conf -def=sensors.def
  del lock
  qm start -conf=qm.conf -def=sensors.def

  SET el=%errorlevel%
  ECHO %el%
  
  :: no error ==> backup
  IF %el%==0 (
    del lock
    del restore\db-2 /q
    rmdir restore\db-2
    move restore\db-1 restore\db-2
    move restore\db restore\db-1    
    xcopy db restore\db /I
  )
  
  :: error ==> restore
  IF not %el% == 0 (
    del lock
    del db /q
    rmdir db
    xcopy restore\db db /I
  )
  
goto loop