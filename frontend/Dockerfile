FROM node

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ADD . /usr/src/app
RUN yarn

ENTRYPOINT ["/bin/bash", "./run.sh"]
CMD ["start"]
