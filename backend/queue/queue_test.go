package queue_test

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	. "github.com/Benjamintf1/queue-app/backend/queue"
	"math/rand"
	"time"
)

var _ = Describe("Que", func() {
	It("Returns list of people using the resource", func(){
		beforeAdd := time.Now()
		q := New(1)
		Expect(q.Add("Test")).To(Succeed())
		Expect(q.Add("Test2")).To(Succeed())
		afterAdd := time.Now()

		list := q.List()
		Expect(list).To(HaveLen(2))
		Expect(list[0].Name).To(Equal("Test"))
		timeStarted := list[0].TimeStarted
		Expect(timeStarted.Before(afterAdd)).To(BeTrue())
		Expect(timeStarted.After(beforeAdd)).To(BeTrue())

		Expect(list[1].Name).To(Equal("Test2"))
	})

	It("Returns list of people using the resource with the time they started using it", func(){
		q := New(1)
		Expect(q.Add("Test")).To(Succeed())
		Expect(q.Add("Test2")).To(Succeed())

		beforeRemove := time.Now()
		Expect(q.Remove("Test")).To(Succeed())
		afterRemove := time.Now()

		list := q.List()
		Expect(list).To(HaveLen(1))
		timeStarted := list[0].TimeStarted
		Expect(timeStarted.Before(afterRemove)).To(BeTrue())
		Expect(timeStarted.After(beforeRemove)).To(BeTrue())
		Expect(timeStarted).ToNot(Equal(time.Time{}))
	})

	It("removes names", func(){
		q := New(0)
		Expect(q.Add("test")).To(Succeed())
		Expect(q.Remove("test")).To(Succeed())

		Expect(q.List()).To(Equal([]Item{}))
	})

	It("ignores external whitespace", func(){
		q := New(0)
		Expect(q.Add("     test")).To(Succeed())

		Expect(q.List()).To(Equal([]Item{ { Name: "test" }}))

		Expect(q.Remove("     test")).To(Succeed())
	})

	It("preserves internal whitespace", func(){
		q := New(0)
		Expect(q.Add(" 1 2")).To(Succeed())

		Expect(q.List()).To(Equal([]Item{ { Name: "1 2" }}))

		Expect(q.Remove(" 1 2")).To(Succeed())
	})

	It("folds internal whitespace", func(){
		q := New(0)
		Expect(q.Add("1         2")).To(Succeed())

		Expect(q.List()).To(Equal([]Item{ { Name: "1 2" }}))

		Expect(q.Remove("1         2")).To(Succeed())
	})

	It("returns an error if name is present in the queue", func(){
		q := New(0)
		Expect(q.Add("test")).To(Succeed())
		Expect(q.Add("test")).ToNot(Succeed())
	})

	It("ignores capitilization", func(){
		q := New(0)
		Expect(q.Add("test")).To(Succeed())
		Expect(q.Add("TeSt")).ToNot(Succeed())
	})

	It("returns an error if name is only whitespace", func(){
		q := New(0)
		Expect(q.Add("     ")).ToNot(Succeed())
	})

	It("doesn't have race conditions", func() {
		q := New(0)
		for i := 0; i < 100; i++ {
			go q.Add(string(rand.Int()))
			go q.Remove(string(rand.Int()))
			go q.List()
		}
	})
})
