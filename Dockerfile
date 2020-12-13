FROM node:14.3.0-slim

RUN addgroup --gid 10001 nonroot && adduser --gecos "NTRobot user" --uid 10000 --gid 10001 --home /home/nonroot --disabled-password nonroot

WORKDIR /home/nonroot/app

# Copy build files and install using yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Copy everything we need over
COPY lang/ lang/
COPY dist/ dist/

RUN chown -R 10000:10001 .

# Use the non-root user to run our application
USER nonroot

CMD [ "yarn", "start"]
