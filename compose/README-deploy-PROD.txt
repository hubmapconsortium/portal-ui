To depoly to production follow the following:

  - on production server, as "hive" user, cd to this directory
  
  - edit the "image:" line in hubmap.yml to point to the version to be release
    like "    image: hubmap/portal-ui:0.93.0", 
  
  - find the current running version, and stop it
    run command: "docker ps", record the id of the portal container  
    run command: "docker stop <container id>"
  
  - download the new image and instantiate/run the container
    run command: "docker-compose -f hubmap.yml up -d --no-build"
  
  - clean up/remove the old image
    run command: "docker image ls | grep portal", record the id of the old/previous version image
    run command: "docker rmi <image id>"
