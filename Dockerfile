## This container compiles src/ files from typescript to javascript
FROM node:15.7.0-alpine AS compiler
WORKDIR /app

# Copy build files and install using yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Copy everything over
COPY . .

RUN yarn build

FROM node:15.7.0-alpine

RUN addgroup --gid 10001 nonroot && adduser --gecos "NTRobot user" --uid 10000 --ingroup nonroot --home /home/nonroot --disabled-password nonroot

WORKDIR /home/nonroot/app

# Copy build files and install using yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Copy everything we need over
COPY lang/ lang/
# Copy dist files over
COPY --from=compiler /app/dist ./dist

RUN chown -R 10000:10001 .

# Use the non-root user to run our application
USER nonroot

CMD [ "yarn", "start"]
