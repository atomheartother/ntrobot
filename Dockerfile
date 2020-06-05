FROM node:14.3.0-slim
WORKDIR /app

# Copy build files and install using yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Copy everything we need over
COPY dist/ dist/

CMD [ "yarn", "start"]
