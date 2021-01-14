import SuggestionService from '../../services/SuggestionService';

describe('SuggestionService', function() {
  let suggestionService = new SuggestionService();
  beforeEach(() => {
    suggestionService = new SuggestionService();
  });

  it('should suggestion empty', function() {
    expect(suggestionService.get('foo')).toBe('');
  });

  it('should not commit empty input', function() {
    suggestionService.commit('');
    expect(suggestionService.get('')).toBe('');
  });

  it('should suggestion text commit', function() {
    suggestionService.commit('foo');
    expect(suggestionService.get('f')).toBe('foo');
  });

  it('should suggestion with params', function() {
    suggestionService.commit('foo -bar -bar1');
    suggestionService.commit('foo -ber');
    expect(suggestionService.get('f')).toBe('foo');
    expect(suggestionService.get('foo')).toBe('');
    expect(suggestionService.get('foo -')).toBe('ber');
    expect(suggestionService.get('foo -bar')).toBe('');
    expect(suggestionService.get('foo -bar -')).toBe('bar1');
    expect(suggestionService.get('foo -bar -bar1')).toBe('');
    expect(suggestionService.get('foo -ba')).toBe('bar');
    expect(suggestionService.get('foo -b')).toBe('ber');
  });

  it('test performance search', function() {
    suggestionService.commit('foo -bar -bar1');
    suggestionService.commit('foo -ber');
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      suggestionService.get('foo -bar -bar1');
    }
    const end = performance.now();
    expect(end - start).toBeLessThan(10);
  });

  it('should restore state with', function() {
    suggestionService.commit('foo');
    const otherSrv = new SuggestionService();
    otherSrv.setState(suggestionService.getState());
    expect(otherSrv.get('f')).toBe('foo');
    expect(otherSrv.getState()).toBe(suggestionService.getState());
  });

});

