package queue

import (
	"errors"
	"sync"
	"strings"
)

type Queuer struct {
	queue []string
	sync.RWMutex
}

func (q *Queuer) List() []string {
	q.RLock()
	defer q.RUnlock()

	return q.queue
}

func (q *Queuer) Add(name string) error {
	q.Lock()
	defer q.Unlock()
	nameToAdd := FoldSpaces(name)
	if nameToAdd == "" {
		return errors.New("Name cannot be blank")
	}

	location := q.exists(nameToAdd)
	if location != -1 {
		return errors.New("name already exists in queue")
	}
	q.queue = append(q.queue, nameToAdd)
	return nil
}

func (q *Queuer) Remove(name string) error {
	q.Lock()
	defer q.Unlock()
	nameToRemove := FoldSpaces(name)

	location := q.exists(nameToRemove)
	if location == -1 {
		return errors.New("name doesn't exist in queue")
	}
	q.queue = append(q.queue[:location], q.queue[location +1:]...)
	return nil
}

func (q *Queuer) exists(name string) (int) {
	for location, existant := range q.queue {
		if strings.ToLower(existant) == strings.ToLower(name) {
			return location
		}
	}
	return -1
}

func FoldSpaces(s string) string{
	return strings.Join(strings.Fields(strings.TrimSpace(s)), " ")
}
