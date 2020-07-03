FROM golang:alpine AS builder

# Set necessary environmet variables needed for our image
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Move to working directory /build
WORKDIR /build

# Copy and download dependency using go mod
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy the code into the container
COPY . .

# Build the application
RUN cd cmd/api && go build -o main
RUN cd cmd/migration && go build -o seed

# Move to /dist directory as the place for resulting binary folder
WORKDIR /dist

# Copy binary from build to main folder
RUN cp /build/cmd/api/main . && cp /build/cmd/api/conf.local.yaml . && cp /build/.env . && cp /build/cmd/migration/seed . && cp -avr /build/assets .

# Build a small image
FROM scratch

COPY --from=builder /dist/main / 
COPY --from=builder /dist/conf.local.yaml /
COPY --from=builder /dist/.env /
COPY --from=builder /dist/seed /
COPY --from=builder /dist/assets /

# Command to run
ENTRYPOINT ["/main"]