package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	"github.com/benjamintf1/queue-app/backend/queue"
)

func main() {
	count, err := strconv.Atoi(os.Getenv("RESOURCE_COUNT"))
	if err != nil {
		count = 2
	}
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		port = 8080
	}
	q := queue.New(count)
	http.HandleFunc("/", List(q))
	http.HandleFunc("/backend/list", List(q))
	http.HandleFunc("/backend/add", Add(q))
	http.HandleFunc("/backend/remove", Remove(q))
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		fmt.Printf("Done serving, error: %s \n", err)
		os.Exit(1)
	}
}

type QueueResponse struct {
	Queue         []queue.Item
	ResourceCount int
}

func List(q *queue.Queue) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		response := QueueResponse{
			Queue:         q.List(),
			ResourceCount: q.ResourceCount,
		}
		marshalledResponse, err := json.Marshal(response)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(marshalledResponse)
	}
}

type QueueRequest struct {
	Name string
}

func Add(q *queue.Queue) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		request := QueueRequest{}
		err = json.Unmarshal(body, &request)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = q.Add(request.Name)
		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write([]byte{})
	}
}

func Remove(q *queue.Queue) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		request := QueueRequest{}
		err = json.Unmarshal(body, &request)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = q.Remove(request.Name)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write([]byte{})
	}
}
