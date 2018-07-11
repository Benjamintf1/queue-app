package queue

import (
	"errors"
	"strings"
	"sync"
	"time"
)

type Queue struct {
	queue         []Item
	ResourceCount int
	sync.RWMutex
}

type Item struct {
	Name        string     `json:"Name"`
	TimeStarted *time.Time `json:"TimeStarted,omitempty"`
}

func New(numberOfResources int) *Queue {
	return &Queue{
		queue:         make([]Item, 0),
		ResourceCount: numberOfResources,
	}
}

func (q *Queue) List() []Item {
	q.RLock()
	defer q.RUnlock()

	return q.queue
}

func (q *Queue) Add(name string) error {
	q.Lock()
	defer q.Unlock()
	nameToAdd := FoldSpaces(name)
	if nameToAdd == "" {
		return errors.New("Name cannot be blank")
	}

	location := q.exists(nameToAdd)
	if location != -1 {
		return errors.New("Name already exists in queue")
	}
	q.queue = append(q.queue, Item{
		Name: nameToAdd,
	})
	if len(q.queue) <= q.ResourceCount {
		correctTime := time.Now()
		q.queue[len(q.queue)-1] = Item{
			Name:        q.queue[len(q.queue)-1].Name,
			TimeStarted: &correctTime,
		}
	}
	return nil
}

func (q *Queue) Remove(name string) error {
	q.Lock()
	defer q.Unlock()
	nameToRemove := FoldSpaces(name)

	location := q.exists(nameToRemove)
	if location == -1 {
		return errors.New("name doesn't exist in queue")
	}
	q.queue = append(q.queue[:location], q.queue[location+1:]...)
	if location < q.ResourceCount && len(q.queue) >= q.ResourceCount {
		correctTime := time.Now()
		q.queue[q.ResourceCount-1] = Item{
			Name:        q.queue[q.ResourceCount-1].Name,
			TimeStarted: &correctTime,
		}
	}
	return nil
}

func (q *Queue) exists(name string) int {
	for location, existant := range q.queue {
		if strings.ToLower(existant.Name) == strings.ToLower(name) {
			return location
		}
	}
	return -1
}

func FoldSpaces(s string) string {
	return strings.Join(strings.Fields(strings.TrimSpace(s)), " ")
}
