


describe("Verso", function() {
  var eventName = 'testEvent';
  var myVerso = new Verso({eventLabel: eventName});

  it("should exist", function() {
    expect(myVerso).to.exist;
  });

  it("be an instance of Verso", function() {
    expect(myVerso).to.be.an.instanceof(Verso);
  });

  it("should emit a custom event", function() {
    var callback = sinon.spy();

    document.addEventListener(eventName, callback);

    myVerso.emit("data");

    expect(callback.called).to.be.true;
  });

  it("should return properties", function() {
    var property = myVerso.property('eventLabel');
    expect(property).to.equal(eventName);
  });

  it("should be able to change properties", function() {
    myVerso.property('eventLabel', 'foobar');
    expect(myVerso.property('eventLabel')).to.not.equal(eventName);

    // Change it back
    myVerso.property('eventLabel', eventName);
  });
});
