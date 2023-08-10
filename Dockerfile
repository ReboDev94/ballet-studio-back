
FROM node:18-alpine As build

WORKDIR /usr/src/app

# copy packages
COPY package*.json ./

# install dependencies
RUN npm ci

# copy all files
COPY . .

# create build
RUN npm run build

# set env production
ENV NODE_ENV production


RUN npm ci --only=production && npm cache clean --force

USER rafa

FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=rafa:rafa --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=rafa:rafa --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]

