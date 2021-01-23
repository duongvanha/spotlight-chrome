import Search from "../../services/SearchService";

describe('SuggestionService', function() {

  it('should suggestion empty', function() {
    const demo = Search('login')
    expect(demo).toBe('');
  });

});

