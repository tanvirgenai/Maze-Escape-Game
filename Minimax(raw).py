def minimax(state, depth, is_enemy_turn):
    """
    Standard Minimax algorithm without Alpha-Beta pruning.
    Enemy is the Maximizer (MAX).
    Player is the Minimizer (MIN).
    """
    # Return heuristic or terminal score when depth limit or game end is reached
    if state.is_terminal():
        return state.terminal_score()[cite: 7]
    
    if depth == 0:
        return state.heuristic()[cite: 7]

    if is_enemy_turn:
        # MAX: Enemy tries to maximize the score
        max_eval = float('-inf')
        legal_actions = state.get_legal_actions(is_enemy=True)[cite: 7]
        
        for action in legal_actions:
            # Generate hypothetical child state without modifying the real game
            child_state = state.apply_action(action, is_enemy=True)[cite: 7]
            eval_score = minimax(child_state, depth - 1, is_enemy_turn=False)[cite: 7]
            max_eval = max(max_eval, eval_score)[cite: 7]
            
        return max_eval
        
    else:
        # MIN: Simulate the Player trying to minimize the score
        min_eval = float('inf')
        legal_actions = state.get_legal_actions(is_enemy=False)[cite: 7]
        
        for action in legal_actions:
            # Generate hypothetical child state without modifying the real game
            child_state = state.apply_action(action, is_enemy=False)[cite: 7]
            eval_score = minimax(child_state, depth - 1, is_enemy_turn=True)[cite: 7]
            min_eval = min(min_eval, eval_score)[cite: 7]
            
        return min_eval

def get_best_enemy_move(state, depth):
    """
    Calculates the actual best action for the enemy using the minimax tree.
    Since the enemy is MAX, it looks for the action yielding the highest score.
    """
    best_action = None
    best_value = float('-inf')
    
    legal_actions = state.get_legal_actions(is_enemy=True)
    
    for action in legal_actions:
        # Simulate the enemy's move
        child_state = state.apply_action(action, is_enemy=True)
        # Call minimax for the next depth, which is the player's (MIN) turn
        move_value = minimax(child_state, depth - 1, is_enemy_turn=False)
        
        # Enemy wants the maximum possible value
        if move_value > best_value:
            best_value = move_value
            best_action = action
            
    return best_action