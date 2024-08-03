Project Setup and Execution:

This project consists of a frontend and a backend service, managed using Docker Compose. Follow the steps below to set up and run the project.

Prerequisites:

Docker: Ensure Docker is installed and running on your machine.
Docker Compose: Ensure Docker Compose is installed. It usually comes bundled with Docker.

Directory Structure

./user-app: Contains the frontend application code and Dockerfile.
./backend: Contains the backend application code and Dockerfile.


Build and Run the Containers

Navigate to the root directory of the project where the docker-compose.yml file is located. Build and start the containers using Docker Compose:

command :-  docker-compose up --build

Access the Application

Frontend: Open your web browser and navigate to http://localhost:3000 to access the frontend application. 
Developed frontend using Next Js, Material UI, Formik (validation).

Backend: The backend service will be running on http://localhost:5000. 
Developed using Node Js, Express Js, and Mongo DB.