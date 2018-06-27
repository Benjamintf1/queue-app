package main

import (
	"encoding/json"
	"github.com/Benjamintf1/queue-app/backend/queue"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

func main() {
	count, err := strconv.Atoi(os.Getenv("RESOURCE_COUNT"))
	if err != nil {
		count = 2
	}
	quer := &queue.Queuer{}
	http.HandleFunc("/list", List(quer, count))
	http.HandleFunc("/add", Add(quer))
	http.HandleFunc("/remove", Remove(quer))
	http.ListenAndServe(":8080", nil)
}

type Queue_Response struct {
	Queue         []string
	ResourceCount int
}

func List(q *queue.Queuer, resourceCount int) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		response := Queue_Response{
			Queue:         q.List(),
			ResourceCount: resourceCount,
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

type Queue_request struct {
	Name string
}

func Add(q *queue.Queuer) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		request := Queue_request{}
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

func Remove(q *queue.Queuer) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		request := Queue_request{}
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
