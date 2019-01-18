test: queue/queue.go queue/queue_test.go main.go
	go test ./...

build: test
	GOOS=linux go build

pack: build
	docker build -t benjamintf1/queue-backend:latest .

upload: pack
	docker push benjamintf1/queue-backend:latest
