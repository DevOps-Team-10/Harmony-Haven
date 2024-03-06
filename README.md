# Harmony-Haven

Project Name: Harmony Haven

Installation : Clone the repo, install npm, express and pm2. 

START THE SERVER : enter the local repo and hit pm2 start app.js  
REFRESH VIEW : just refresh the browser, changes should reflect
REFRESH SERVER (after changes in the app.js) : pm2 restart app.js
STOP THE SERVER : pm2 stop app.js

Any errors in local deployment - check if the port (deafult 3000) is occupied or not
GET PID : lsof -i :3000 (macOS, not sure about windows please look it up)
KILL : kill <PID>
THAT SHOULD FIX THE DEPLOYMENT ISSUES

Purpose: Harmony Haven is a website aimed at promoting wellness through herbal remedies and spiritual lifestyle practices. This project serves as an assignment for our Software Engineering MTech 2nd sem DevOps, showcasing our skills in DevOps practices.

Key Features:

Website development using Express.js for backend and frontend. Implementation of GitHub workflows for continuous integration and deployment. Unit testing with frameworks like Maven, Gradle, and Selenium. Integration with AWS Lambda for serverless microservices. Deployment on AWS infrastructure. Technologies/Languages Used:

Frontend: HTML, CSS, JavaScript (with Express.js) 

Backend: Node.js, Express.js DevOps: GitHub Workflows, Maven, Gradle 

Testing: Selenium Cloud Services: AWS Lambda 

Installation Instructions: Clone the repository. Install Node.js and npm if not already installed. Install dependencies using npm install. Follow additional setup instructions provided in the project documentation. 

Usage: After setup, run the application locally using npm start. Trigger GitHub workflows for CI/CD. Execute unit tests with Maven, Gradle, or Selenium. 

Contributing Guidelines: Contributions are welcome. Refer to CONTRIBUTING.md for guidelines.

License: Not sure what license this project comes under. 

Contact Information: For inquiries or assistance, please contact: 2023sl93002@wilp.bits-pilani.ac.in
2023sl93025@wilp.bits-pilani.ac.in

