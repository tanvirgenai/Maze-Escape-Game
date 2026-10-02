from backend.services.game_service import reset_game, player_move

def test_game_starts():
    state = reset_game()
    assert state.status == "running"
    assert state.player != state.goal
