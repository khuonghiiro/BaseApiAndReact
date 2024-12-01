ARG BASE_IMAGE=node:18.17-alpine

# ================================================================
# builder stage
# ================================================================
FROM $BASE_IMAGE as builder
ENV NODE_ENV=test
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache bash git
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --force
COPY . ./
RUN npm run build

# ================================================================
# final deploy stage
# ================================================================
FROM $BASE_IMAGE
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["npm", "start"]
