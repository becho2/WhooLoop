import { getDateTimeNow, getHHmm, getToday } from './helper';

describe('test getDateTimeNow helper functions', () => {
  const dateTimeNow: string = getDateTimeNow();
  it('YYYY-MM-DD HH:mm:ss format and starts with 20(until 2099 year true)', () => {
    expect(dateTimeNow).toMatch(
      new RegExp(
        '20[0-9][0-9]-[0-1][0-9]-[0-3][0-9] [0-1][0-9]:[0-5][0-9]:[0-5][0-9]',
      ),
    );
  });
});

describe('test getToday helper functions', () => {
  const today: string = getToday();
  it('YYYYMMDD format and starts with 20(until 2099 year true)', () => {
    expect(today).toMatch(new RegExp('20[0-9][0-9][0-1][0-9][0-3][0-9]'));
  });
});

describe('test getHHmm helper functions', () => {
  const HHmm: string = getHHmm();
  it('HHmm format', () => {
    expect(HHmm).toMatch(new RegExp('[0-1][0-9][0-5][0-9]'));
  });
});
