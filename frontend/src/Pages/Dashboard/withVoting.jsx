import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// Higher-Order Component to add voting functionality to subcomponents for better code reuse
const withVoting = (WrappedComponent, componentName) => {
  const ComponentWithVoting = (props) => {
    const [vote, setVote] = useState(null); // can be 'up', 'down', or null
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVote = async (newVote, content) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const finalVote = vote === newVote ? null : newVote;
      setVote(finalVote);

      // Only send data to the backend if it's an up or down vote
      if (finalVote) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/votes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ componentName, vote: finalVote, content }),
          });
          if (!response.ok) {
            console.error('Failed to submit vote.');
            setVote(vote); // Revert vote on failure
          }
        } catch (error) {
          console.error('Error submitting vote:', error);
          setVote(vote); // Revert vote on failure
        }
      }
      setIsSubmitting(false);
    };

    const votingButtons = (contentToVoteOn) => (
      <Box>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleVote('up', contentToVoteOn); }} disabled={isSubmitting}>
          {vote === 'up' ? <ThumbUpIcon color="primary" /> : <ThumbUpOffAltIcon />}
        </IconButton>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleVote('down', contentToVoteOn); }} disabled={isSubmitting}>
          {vote === 'down' ? <ThumbDownIcon color="error" /> : <ThumbDownOffAltIcon />}
        </IconButton>
      </Box>
    );

    return <WrappedComponent {...props} votingButtons={votingButtons} />;
  };

  ComponentWithVoting.displayName = `WithVoting(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithVoting;
};

export default withVoting;
