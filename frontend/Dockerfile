
#install dependencies use node.js
FROM node:20-alpine AS builder

#set the working directory


WORKDIR /app

#copy packcge.json and other lock file to levarage docker cache
#code is chnaged and all the node modules are not re-iinstalled

#COPY  package.json yarn.lock* pnpm-lock.yaml* ./
COPY  package.json package-lock.json ./

#install dependencies based on lock files
RUN npm install --frozen-lockfile --production=false

#copy rest of the code

COPY . .

#biuld the next ks

RUN npm run build


#create lightweight image
FROM node:20-alpine AS runner

#set env for production

ENV NODE_ENV production

#working directory 

WORKDIR /app


#copy necessary files

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
#expose frontend port

EXPOSE 3000


#command to start production

CMD ["npm", "start"]
