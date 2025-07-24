FROM node:alpine

ARG NEXT_PUBLIC_GEMINI_API_KEY=${NEXT_PUBLIC_GEMINI_API_KEY}
ARG NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}


RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json package-lock.json ./

RUN apk update 
RUN apk add --no-cache gettext
RUN apk add --no-cache git

# USER node

RUN npm install --pure-lockfile 

COPY --chown=node:node . .

RUN sh -c "envsubst  < ./env.template > ./.env.local"
RUN cat ./.env.local

RUN npm build

EXPOSE 3000

CMD ["npm", "start"]