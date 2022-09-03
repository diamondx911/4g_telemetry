


var cloudmadeUrl = 'https://api.mapbox.com/styles/v1/diamondx/cjwsr2pf10hg51cppv5o073c4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGlhbW9uZHgiLCJhIjoiY2o4Y3FkaDBnMGYxazJxcmxnaWozY3BmayJ9.VCKI441_mo6-ArU1qUU5pg';
	            var subDomains = ['otile1','otile2','otile3','otile4'];
	            var cloudmade = new L.TileLayer(cloudmadeUrl, { maxZoom: 20, subdomains: subDomains});
			
var map = new L.Map('map',{attributionControl: false,zoomControl:false,layers : [cloudmade]}).fitWorld();
							
var iss;

var firefoxIcon = L.icon({
        iconUrl: 'plane.png',
        iconSize: [32, 32],
        iconAnchor: [16,16],
        className: 'blinking' // size of the icon
        });
map.setZoom(18);
var marker = new DriftMarker([35, 139], {
        draggable: true,
        title: "Resource location",
        icon: firefoxIcon,
        alt: "Resource Location",
        rotationAngle: 45,
        riseOnHover: true
      })
        .addTo(map)

const testing = setInterval(function() {
        // send a message to the server
        socket.emit("gps", (response) => {
            //map.setZoom(13);
            //var latitude = Math.random() * (35.01- 35) + 35;
            //var longitude = Math.random() * (138.01 - 138) + 138;
            //if (!iss) {iss = L.marker([latitude,longitude], {icon: firefoxIcon}).bindPopup("I am the ISS").addTo(map);}
            //iss = L.marker([latitude,longitude], {icon: firefoxIcon}).bindPopup("I am the ISS").addTo(map);
            //iss.setLatLng([latitude,longitude]).update();
            //var latLngs = [ iss.getLatLng() ];
            //var markerBounds = L.latLngBounds(latLngs);
            //map.fitBounds(markerBounds);
            //console.log('gps acquired')



            
           // console.log("e.latlng", e.latlng);
            marker.slideTo([response.lat,response.long], { duration: 1500, keepAtCenter: true });
            //console.log(response.lat);
            marker.setRotationAngle(response.heading);
            // Update marker on changing it's position
            marker.on("dragend", function (ev) {
              var chagedPos = ev.target.getLatLng();
              this.bindPopup(chagedPos.toString()).openPopup();
              
            });
        
        
        
        });

         //console.log('doing somehting');
     
      }, 500);

         

        
