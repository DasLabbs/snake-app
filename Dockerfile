FROM node:20-alpine AS build

WORKDIR /webapps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts
COPY . .
RUN yarn build:prod

FROM nginx:alpine AS run
WORKDIR /webapps
COPY --from=build /webapps/dist /webapps
COPY --from=build /webapps/public /webapps/public
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
