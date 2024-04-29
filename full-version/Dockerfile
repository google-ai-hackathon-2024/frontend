# Step 1: Use the official Node.js 16 image as the base image
FROM node:16-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Step 4: Install dependencies
RUN yarn install

# Step 5: Copy the rest of your app's source code from your host to your container's working directory
COPY . ./

# Step 6: Build the application for production
RUN yarn build

# Step 7: Install 'serve' to run the application
RUN yarn global add serve

# Step 8: Expose the port that 'serve' will run on
EXPOSE 3000

# Step 9: Run 'serve' to serve the application
CMD ["serve", "-s", "build", "-l", "3000"]
