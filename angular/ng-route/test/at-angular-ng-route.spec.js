/* global adobe */
describe('greeter', function () {
  beforeAll(function () {
    spyOn(console, 'log');

    adobe.target.ext.myGreetingExtension('Walter');
  });

  it('should log to console', function () {
    expect(console.log).toHaveBeenCalled();
  });

  it('should greet caller', function () {
    expect(adobe.target.ext.myGreetingExtension('John')).toEqual('Hello, John!');
  });

  it('should fail', function () {
    expect(true).toEqual(false);
  });

  it('should not fail', function () {
    expect(true).toEqual(true);
  });
});
