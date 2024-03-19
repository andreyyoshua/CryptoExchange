# Cryptocurrency Exchange Web Page

This project is a cryptocurrency exchange web page built using Next.js with WebSocket connection. It provides real-time updates of cryptocurrency prices 

Data is provided by [Binance](https://github.com/binance/binance-spot-api-docs). If your region blocked Binance, please use VPN, otherwise you will get dummy data

## Features

- Real-time updates of cryptocurrency prices using WebSocket connection.
- Responsive design for seamless user experience across devices.
- Comprehensive error handling to ensure smooth user interactions.
- Documentation for easy setup and maintenance.
- Light and Dark Mode UI

## Technologies Used

- **Next.js**: Frontend framework for building React applications.
- **WebSocket**: Protocol for real-time communication between client and server.
- **React**: JavaScript library for building user interfaces.
- **Node.js**: JavaScript runtime environment for server-side development.
- **Material UI https://mui.com/**: Components.
- **Redux**: State Managements
- **Docker**: For better development (Optional)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/andreyyoshua/CryptoExchange
   ```

2. Install Dependencies:

   ```bash
   cd CryptoExchange
   npm install
   ```

3. Configure environment variables:
   Adjust .env.local file in the root directory and add the necessary environment variables, including database connection strings, API keys, etc (f needed)

4. Run the Project
   ```bash
   npm run dev
   ```

5. Open your web browser and navigate to http://localhost:3000 to view the application.


## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
1. Build your container: `docker build -t nextjs-docker .`.
1. Run your container: `docker run -p 3000:3000 nextjs-docker`.

You can view your images created with `docker images`.

## License
This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Contact
For any inquiries or feedback, please contact andrey.yoshua@gmail.com

## Screenshots
<div align="center">
  <img alt="Screenshot 2024-03-18 at 21 21 27" src="https://github.com/andreyyoshua/CryptoExchange/assets/17944191/f481989d-ebdc-41db-af74-edc92d46f6a0" width="45%">
  <img alt="Screenshot 2024-03-18 at 21 20 58" src="https://github.com/andreyyoshua/CryptoExchange/assets/17944191/f597cab7-e0e7-4cf8-b512-e2093796cd7b" width="45%">
</div>


