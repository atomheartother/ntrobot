WORKDIR /app

# Copy build files and install using yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Copy everything over
COPY . .

CMD [ "node", "-r", "esm", "src/index.js"]
