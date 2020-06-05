FROM node:14.3.0-slim AS tsbuilder
# Copy build files and install using yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY src/ src/
COPY tsconfig.json .

RUN yarn build

FROM node:14.3.0-slim
WORKDIR /app

# Copy build files and install using yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Copy everything we need over
COPY --from=tsbuilder /dist dist/

CMD [ "yarn", "start"]
