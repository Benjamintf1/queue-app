package queue_test

import (
	"testing"

	"time"

	"github.com/benjamintf1/queue-app/backend/queue"
	. "github.com/benjamintf1/queue-app/backend/queue"
)

func TestAddAndRemove(t *testing.T) {
	q := queue.New(1)
	if q.Add("Test") != nil {
		t.Fatalf("Expected add to succeed")
	}
	if q.Add("Test2") != nil {
		t.Fatalf("Expected add to succeed")
	}

	list := q.List()
	if len(list) != 2 {
		t.Fatalf("Expected list to have a length of 2, was %d", len(list))
	}
	if list[0].Name != "Test" {
		t.Fatalf("Expected list entry 1 to be Test, was %s", list[0].Name)
	}

	if list[1].Name != "Test2" {
		t.Fatalf("Expected list entry 2 to be Test, was %s", list[1].Name)
	}

	if q.Remove("Test") != nil {
		t.Fatalf("Expected remove to succeed")
	}
	list = q.List()
	if len(list) != 1 {
		t.Fatalf("Expected list to have a length of 1, was %d", len(list))
	}
	if list[0].Name != "Test2" {
		t.Fatalf("Expected list entry 1 to be Test2, was %s", list[0].Name)
	}

	if q.Remove("Test2") != nil {
		t.Fatalf("Expected remove to succeed")
	}

	list = q.List()
	if len(list) != 0 {
		t.Fatalf("Expected list to have a length of 0, was %d", len(list))
	}
}

func TestTimeStartedList(t *testing.T) {
	q := New(1)
	beforeAdd := time.Now()
	if q.Add("Test") != nil {
		t.Fatalf("Expected add to succeed")
	}
	afterAdd := time.Now()
	if q.Add("Test2") != nil {
		t.Fatalf("Expected add to succeed")
	}
	list := q.List()
	timeStarted := list[0].TimeStarted
	if timeStarted.After(afterAdd) || timeStarted.Before(beforeAdd) {
		t.Fatalf("expected time started to be accurate")
	}
	beforeRemove := time.Now()
	if q.Remove("Test") != nil {
		t.Fatalf("Expected remove to succeed")
	}
	afterRemove := time.Now()

	list = q.List()
	timeStarted = list[0].TimeStarted
	if len(list) != 1 {
		t.Fatalf("Expected list to have a length of 1, was %d", len(list))
	}
	if timeStarted.After(afterRemove) || timeStarted.Before(beforeRemove) {
		t.Fatalf("expected time started to be accurate")
	}
	if timeStarted.Equal(time.Time{}) {
		t.Fatalf("Time should not be unix epoch")
	}
}

func TestSpacing(t *testing.T) {
	q := New(0)
	if q.Add("     tEsT    t") != nil {
		t.Fatalf("Expected add to succeed")
	}

	name := q.List()[0].Name
	if name != "tEsT t" {
		t.Fatalf("Expected name to be correctly normalized, was %s", name)
	}
}

func TestBadAddAndRemove(t *testing.T) {
	q := New(0)
	if q.Add("     t ") != nil {
		t.Fatalf("Expected add to succeed")
	}

	if q.Add("T") == nil {
		t.Fatalf("Expected add to fail")
	}
	if q.Add(" ") == nil {
		t.Fatalf("Expected add to fail")
	}
	if q.Remove(" ") == nil {
		t.Fatalf("Expected remove to fail")
	}
	if q.Remove("abcd") == nil {
		t.Fatalf("Expected remove to fail")
	}
}
