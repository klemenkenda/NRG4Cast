del lock
qm create -conf=qm.conf -def=sensors.def
qm start -conf=qm.conf -def=sensors.def
echo Exit Code is %errorlevel%
pause