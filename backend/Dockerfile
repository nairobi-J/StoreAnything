
#build spring boot application
FROM maven:3-openjdk-17 AS build

#setting up working directory
WORKDIR /app 

#dont need to re download every dependency
COPY pom.xml .

#copy the source code
COPY src ./src

#build the spring boot application
#dmaven.test.skip should be true
RUN mvn clean package -Dmaven.test.skip=true

#create the final lightweight runtime image

FROM openjdk:17 AS runner

#set owrking directory

WORKDIR /app


#copy the jar file build stage 
COPY --from=build /app/target/*.jar app.jar


#expose the aplication

EXPOSE 8080

#command to run application

ENTRYPOINT ["java", "-jar", "app.jar"]




