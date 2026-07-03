const scripts = {
  'Account Takeover': {
    tone: 'Scared but cooperative',
    credibility: 86,
    answers: {
      'Did you approve a new device?': 'No. I only use my regular phone. I got an alert about a new device, but by the time I opened the app, the password was already changed.',
      'Did you receive profile change alerts?': 'Yes, two texts came in back-to-back. One said my phone number changed, and another said a security code was used. I did not request either one.',
      'Did anyone have access to your phone or email?': 'No one had my phone, but I did get a call from someone claiming to be the bank. They asked me to read back a code to stop a transfer.',
    },
    clue: 'Possible social engineering: customer shared an OTP after a spoofed bank call.',
  },
  'First-Party Fraud': {
    tone: 'Defensive and inconsistent',
    credibility: 48,
    answers: {
      'Did anyone at your address receive the item?': 'No, nobody got it. Well, my sister was home, but she said she did not see anything at the door.',
      'Did the merchant provide tracking?': 'They sent tracking, but that does not prove I received it. Packages go missing here sometimes.',
      'Have you filed similar claims before?': 'Maybe once or twice. I order a lot online, so I do not remember every dispute.',
    },
    clue: 'Customer minimizes prior claims and gives a vague household delivery answer.',
  },
  Chargeback: {
    tone: 'Frustrated but partly credible',
    credibility: 71,
    answers: {
      'Do you recognize this merchant?': 'I recognize the name, but I thought it was a trial. I did not expect the full annual charge.',
      'Did you contact the merchant first?': 'I used their chat after I saw the charge. They said I was one day late to cancel.',
      'Does the shipping address belong to you?': 'This was digital, not shipped. I stopped using it as soon as I saw the renewal.',
    },
    clue: 'Customer recognizes merchant, so the issue is likely billing/terms rather than unauthorized fraud.',
  },
  'Credit Risk': {
    tone: 'Optimistic but under-documented',
    credibility: 63,
    answers: {
      'What is your employer and start date?': 'I started recently, but I also do contract work. The income is a mix of payroll and transfers from clients.',
      'Is your income gross or net?': 'I gave the gross number. The deposits may look lower because some clients pay through apps.',
      'Can you provide support records?': 'I can send screenshots today and maybe statements later. I do not have everything organized yet.',
    },
    clue: 'Income story needs verification before approving exposure.',
  },
  'Application Verification': {
    tone: 'Confused and cautious',
    credibility: 69,
    answers: {
      'Did you submit this application?': 'I started one, but I did not finish it. I got an email saying it was submitted anyway.',
      'Can you confirm current and previous address?': 'Current address is right. The old address looks familiar, but I have not lived there for years.',
      'Can you complete selfie verification?': 'Yes, I can do that. I want to make sure nobody opened something in my name.',
    },
    clue: 'Customer partially recognizes the application but not the final submission.',
  },
  'Email Fraud / BEC': {
    tone: 'Embarrassed and rushed',
    credibility: 78,
    answers: {
      'Who requested the payment change?': 'It looked like our vendor. The email had the same signature block, but I now see the address is slightly different.',
      'Was the change confirmed by phone?': 'No. We were trying to close payroll, and I approved it from the email thread.',
      'Was this beneficiary used before?': 'No, this was the first time using that account. I thought it was their new bank.',
    },
    clue: 'Payment change was not verified by callback and beneficiary was new.',
  },
};

export function getInterviewAnswer(caseData, question, count = 0) {
  const script = scripts[caseData.type];
  if (!script) {
    return {
      answer: 'I need to check my records before I can answer that clearly.',
      tone: 'Unclear',
      credibility: 55,
      clue: 'No claim-type script found.',
    };
  }

  const answer = script.answers[question] || 'I am not completely sure, but I can try to provide more documentation.';
  const followUp = count > 0 ? ' I already answered this, so I would compare my answer against the documents instead of asking the same question again.' : '';

  return {
    answer: `${answer}${followUp}`,
    tone: script.tone,
    credibility: Math.max(25, script.credibility - count * 8),
    clue: script.clue,
  };
}
