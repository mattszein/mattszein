FROM node:22.7-alpine3.19
ENV APP_HOME /mattszeinweb
WORKDIR $APP_HOME

RUN npm install -g pnpm

COPY . .
RUN pnpm install
RUN pnpm run build

CMD ["pnpm", "start"]
