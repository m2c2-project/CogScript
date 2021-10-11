"Scripted version of the Color Naming (Stroop) Task."

"Color words are presented in a font color that is either the same as the presented word (congruent) or different (incongruent)."
"Choices are 2AF, where participants must report the FONT COLOR, not the COLOR WORD, as quickly and accurately as possible."

"Fixations between trials is jittered between 500-1000ms, randomly selected via random number generator."
"Defaults:"
    "50% of trials are congruent (other 50% are incongruent)."
    "Correct responses are presented 50% on the left side, and 50% on the right."
    "No blocks."

"Recommended trial number remain equal as to not upset congruency/repsonse values."

"Trial sequence (II,IC,CC,CI) is not explicitly coded, but testing indicates roughly ~25% of each condition is being run."

"Sample XML Code (using Defaults - remove single quotes):"
'<Screen id="game_Stroop">'
	'<cogtask type="script"'
        'script="stroop"'
        'trialNum="20"'
        'StartDelay="1000"'
        'instructions="quick_instructions">'
     '</cogtask>'
	'<nextScreen id="next_game" />'
'</Screen>'