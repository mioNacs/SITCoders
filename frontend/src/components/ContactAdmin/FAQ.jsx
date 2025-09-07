import React, { useState } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

const faqData = [
  {
    question: 'How do I reset my password?',
    answer:
      'To reset your password, go to the login page and click on the "Forgot Password" link. Follow the instructions sent to your registered email to set a new password.',
  },
  {
    question: 'How can I edit my profile?',
    answer:
      'You can edit your profile by navigating to your profile page and clicking the "Edit Profile" button. You can update your name, bio, and profile picture there.',
  },
  {
    question: 'Why can\'t I post or comment?',
    answer:
      'New users must be verified by an administrator before they can post or comment. This is to ensure a safe and authentic community. If you\'ve just signed up, please wait for an admin to approve your account. If you\'ve been waiting a while, feel free to contact an admin.',
  },
  {
    question: 'How do I report a post or comment?',
    answer:
      'To report a post or comment, click the three dots on the top right of the post or comment and select the "Report" option. Our admin team will review it shortly.',
  },
  {
    question: 'What are the different post tags for?',
    answer:
      'Tags help categorize posts. "General" is for any topic. "Query" is for questions. "Project" is for showcasing your work. "Announcement" and "Event" are special tags used by admins for official updates.',
  },
  {
    question: 'How do I submit a resource?',
    answer:
      'Navigate to the "Resources" page and click the "Submit Resource" button. Fill out the form with the resource details. It will be reviewed by an admin before being published.',
  },
  {
    question: 'What is the "Collaborate" page for?',
    answer:
      'The "Collaborate" page is a feature we\'re planning for the future! Soon, you\'ll be able to find project partners and collaborate with other students right here on SITCoders.',
  },
  {
    question: 'What are the rules for posting?',
    answer:
      'We encourage open discussion, but all posts must adhere to our community guidelines. Avoid spam, hate speech, and personal attacks. A detailed list of rules can be found in our Terms & Conditions.',
  },
  {
    question: 'How does the reputation system work?',
    answer:
      'You earn reputation points when other users upvote your posts and comments. Higher reputation unlocks new privileges and shows your contribution to the community.',
  },
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center py-4 text-left font-semibold text-gray-700 hover:text-orange-500 focus:outline-none transition-colors"
                >
                  <span>{faq.question}</span>
                  <FiChevronDown
                    className={`transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-4 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p>Try searching for a different keyword.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default FAQ;