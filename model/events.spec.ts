import Events from "./events";

describe("Events with subscription to a EventName", () => {
  const callback = jest.fn();
  let events: Events;

  beforeEach(() => {
    callback.mockReset();
    events = new Events();
    events.on("EventName", callback);
  });

  it("callback should not be called without a trigger", () =>
    expect(callback).toHaveBeenCalledTimes(0));

  describe("triggering EventName", () => {
    beforeEach(() => events.trigger("EventName", undefined));

    it("calls a callback", () => expect(callback).toHaveBeenCalledTimes(1));
  });

  describe("triggering NonExistingEventName", () => {
    beforeEach(() => events.trigger("NonExistingEventName", undefined));

    it("does not call a callback", () =>
      expect(callback).toHaveBeenCalledTimes(0));
  });

  describe("when offing from a EventName", () => {
    beforeEach(() => events.off("EventName", callback));

    it("triggering EventName does not call a callback", () => {
      events.trigger("EventName", undefined);
      expect(callback).toHaveBeenCalledTimes(0);
    });
  });
});

it("Typed events should pass payload to a callback", () => {
  const cb = jest.fn();
  type EventDefinitions = {
    emptyEvent: void;
    increment: number;
    customPayload: { payloadData: string };
  };
  const events = new Events<EventDefinitions>();

  const callback: Action<{ payloadData: string }> = cb;

  events.on("customPayload", callback);

  events.trigger("customPayload", { payloadData: "42" });

  expect(cb).toHaveBeenCalledWith({ payloadData: "42" });
});
