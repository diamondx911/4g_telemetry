from email import message
from time import sleep
import eventlet
import socketio
import logging
import io
from dronekit import connect, VehicleMode, LocationGlobalRelative, LocationGlobal, Command

sio = socketio.Server()
sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio)

#vehicle = connect('/dev/serial/by-id/usb-ArduPilot_Pixhawk4_380037000A51383531393033-if00', wait_ready=True)

autopilot_logger = logging.getLogger('autopilot')
autopilot_logger.propagate = True
autopilot_logger.setLevel(logging.DEBUG)
log_capture_string = io.StringIO(newline="\r\n")
ch = logging.StreamHandler(log_capture_string)
ch.setLevel(logging.NOTSET)
autopilot_logger.addHandler(ch)

vehicle = connect('udpout:192.168.193.57:14553', wait_ready=True)

@sio.event
def hello(sid):
    msg = { 'altitude':round(vehicle.location.global_relative_frame.alt), 
            'battery':round(vehicle.battery.voltage,2),
            'num_satellite':vehicle.gps_0.satellites_visible,
            'hdop':vehicle.gps_0.eph * 0.01,
            'airspeed':round(vehicle.airspeed,1),
            'armable':vehicle.is_armable,
            'firmware':vehicle.version.major,
            'heading': vehicle.heading,
            'mode':vehicle.mode.name
            }
    #print(vehicle.gps_0.eph * 0.01)
    return msg, 123

@sio.event
def doTAKEOFF(sid):
    msg = "taking off to 20m"
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True
    while not vehicle.armed: 
        sleep(1)
    vehicle.simple_takeoff(20)
    return msg, 123

@sio.event
def doRTL(sid):
    msg = "returning to home"
    vehicle.mode = VehicleMode("RTL")
    return msg, 123

@sio.event
def doGUIDED(sid):
    msg = "switching to Guided"
    vehicle.mode = VehicleMode("GUIDED")
    return msg, 123

@sio.event
def doAUTO(sid):
    msg = "switching to Auto"
    vehicle.mode = VehicleMode("AUTO")
    return msg, 123

@sio.event
def doLOITER(sid):
    msg = "switching to Loiter"
    vehicle.mode = VehicleMode("LOITER")
    return msg, 123

@sio.event
def doLOGGING(sid):
    log_contents = log_capture_string.getvalue()
    length = len(log_contents.split("\r"))
    str = log_contents.split("\r")
    #print(str)
    #print(str[length - 2])
    #print(length)
    log_msg = {
        'logging_message' : str
    }
    return log_msg, 123


    

@sio.event
def gps(sid):
    #print("getting gps")
    msg = { 'lat':vehicle.location.global_relative_frame.lat, 
            'long':vehicle.location.global_relative_frame.lon,
            'heading': vehicle.heading
    }
    
    #print(msg)
    return msg, 123


@sio.event
def connect(sid, environ):
    print('holla')

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

#ESI.local 192.168.2.95
if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 5000)), app)
