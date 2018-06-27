package queue_test

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	. "github.com/Benjamintf1/queue-app/queue"
	"math/rand"
)

var _ = Describe("Que", func() {
	It("adds names and lists those names", func(){
		q := Queuer{}
		Expect(q.Add("Test")).To(Succeed())

		Expect(q.List()).To(Equal([]string{"Test"}))
	})

	It("removes names", func(){
		q := Queuer{}
		Expect(q.Add("test")).To(Succeed())
		Expect(q.Remove("test")).To(Succeed())

		Expect(q.List()).To(Equal([]string{}))
	})

	It("ignores external whitespace", func(){
		q := Queuer{}
		Expect(q.Add("     test")).To(Succeed())

		Expect(q.List()).To(Equal([]string{"test"}))

		Expect(q.Remove("     test")).To(Succeed())
	})

	It("preserves internal whitespace", func(){
		q := Queuer{}
		Expect(q.Add(" 1 2")).To(Succeed())

		Expect(q.List()).To(Equal([]string{"1 2"}))

		Expect(q.Remove(" 1 2")).To(Succeed())
	})

	It("folds internal whitespace", func(){
		q := Queuer{}
		Expect(q.Add("1         2")).To(Succeed())

		Expect(q.List()).To(Equal([]string{"1 2"}))

		Expect(q.Remove("1         2")).To(Succeed())
	})

	It("returns an error if name is present in the queue", func(){
		q := Queuer{}
		Expect(q.Add("test")).To(Succeed())
		Expect(q.Add("test")).ToNot(Succeed())
	})

	It("ignores capitilization", func(){
		q := Queuer{}
		Expect(q.Add("test")).To(Succeed())
		Expect(q.Add("TeSt")).ToNot(Succeed())
	})

	It("returns an error if name is only whitespace", func(){
		q := Queuer{}
		Expect(q.Add("     ")).ToNot(Succeed())
	})

	It("doesn't have rece conditions", func() {
		q := Queuer{}
		for i := 0; i < 100; i++ {
			go q.Add(string(rand.Int()))
			go q.Remove(string(rand.Int()))
			go q.List()
		}
	})
})
