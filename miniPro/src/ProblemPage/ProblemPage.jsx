import React, { useState, useEffect } from "react";
import { auth, db } from "../login/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { ArrowLeft, Check, X, BoxArrowUpRight } from "react-bootstrap-icons";

const ProblemPage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [checkedProblems, setCheckedProblems] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clickTimeout, setClickTimeout] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadUserProgress(currentUser.uid);
      } else {
        setUser(null);
        setCheckedProblems({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProgress = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setCheckedProblems(userDoc.data().problemProgress || {});
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleProblemClick = (topicTitle, problemName) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleUncheckProblem(topicTitle, problemName);
    } else {
      const timeout = setTimeout(() => {
        handleCheckProblem(topicTitle, problemName);
        setClickTimeout(null);
      }, 200);
      setClickTimeout(timeout);
    }
  };

  const handleCheckProblem = async (topicTitle, problemName) => {
    if (!user) {
      alert("Please log in to save progress.");
      return;
    }

    const newCheckedProblems = { ...checkedProblems };
    if (!newCheckedProblems[topicTitle]) {
      newCheckedProblems[topicTitle] = {};
    }
    newCheckedProblems[topicTitle][problemName] = true;

    setCheckedProblems(newCheckedProblems);
    await saveProgress(newCheckedProblems);
  };

  const handleUncheckProblem = async (topicTitle, problemName) => {
    if (!user) return;

    const newCheckedProblems = { ...checkedProblems };
    if (newCheckedProblems[topicTitle]) {
      newCheckedProblems[topicTitle][problemName] = false;
      setCheckedProblems(newCheckedProblems);
      await saveProgress(newCheckedProblems);
    }
  };

  const saveProgress = async (progressData) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { problemProgress: progressData }, { merge: true });
    } catch (error) {
      console.error("Error saving progress:", error);
      alert("Failed to save progress. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "120vh",
          backgroundColor: "#0a192f",
        }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "120vh",
        backgroundColor: "#0a192f",
        color: "#ccd6f6",
        paddingTop: "2rem",
        paddingBottom: "2rem",
        
      }}
    >
      <Container>
        {selectedTopic ? (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button
                variant="outline-primary"
                onClick={() => setSelectedTopic(null)}
                className="d-flex align-items-center gap-2"
                style={{
                  borderColor: "#64ffda",
                  color: "#64ffda",
                  backgroundColor: "transparent",
                }}
              >
                <ArrowLeft size={18} /> Back to Topics
              </Button>
              <Badge
                style={{
                  backgroundColor: "rgba(100, 255, 218, 0.1)",
                  color: "#64ffda",
                  fontSize: "1rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                }}
              >
                {
                  selectedTopic.problems.filter(
                    (problem) =>
                      checkedProblems[selectedTopic.title]?.[problem.name]
                  ).length
                }
                /{selectedTopic.problems.length} Solved
              </Badge>
            </div>
<Card
  style={{
    backgroundColor: "#121212",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  }}
>
  <Card.Body>
    <div className="text-center mb-4">
      <div className="mb-2" style={{ fontSize: "3rem", color: "#64ffda" }}>
        {selectedTopic.icon}
      </div>
      <h2
        style={{
          color: "#ffffff",
          marginBottom: "1rem",
          fontWeight: "600",
        }}
      >
        {selectedTopic.title}
      </h2>
      <p
        style={{
          color: "#b0b0b0",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {selectedTopic.description}
      </p>
    </div>

    <div className="table-responsive">
      <Table
        hover
        style={{
          marginBottom: 0,
          color: "#ffffff",
          backgroundColor: "#1e1e1e",
          borderCollapse: "separate",
          borderSpacing: "0",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#2a2a2a",
              color: "#64ffda",
            }}
          >
            <th 
              className="text-center" 
              style={{ 
                width: "5%",
                padding: "12px 15px",
                borderBottom: "2px solid #64ffda",
                borderRight: "1px solid #3a3a3a",
                color: "#04f067",
               backgroundColor: "#000000",
              }}
            >
              #
            </th>
            <th 
              style={{ 
                width: "55%",
                padding: "12px 15px",
                borderBottom: "2px solid #64ffda",
                            borderRight: "1px solid #3a3a3a",
                color: "#04f067",
               backgroundColor: "#000000",
              }}
            >
              Problem
            </th>
            <th 
              className="text-center" 
              style={{ 
                width: "20%",
                padding: "12px 15px",
                borderBottom: "2px solid #64ffda",
                borderRight: "1px solid #3a3a3a",
                color: "#04f067",
               backgroundColor: "#000000",
              }}
            >
              Status
            </th>
            <th 
              className="text-center" 
              style={{ 
                width: "20%",
                padding: "12px 15px",
                borderBottom: "2px solid #64ffda",
                color: "#04f067",
               backgroundColor: "#000000",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedTopic.problems.map((problem, index) => {
            const isChecked =
              checkedProblems[selectedTopic.title]?.[problem.name];
            return (
              <tr
                key={index}
                style={{
                  backgroundColor: isChecked ? "#1e1e1e" : "#1e1e1e",
                  transition: "all 0.3s ease",
                }}
              >
                <td
                  className="text-center"
                  style={{ 
                    color: "#ffffff",
                    padding: "12px 15px",
                    borderBottom: "1px solid #2d2d2d",
                    borderRight: "1px solid #3a3a3a",
                    backgroundColor: "#1e1e1e"
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{ 
                    padding: "12px 15px",
                    borderBottom: "1px solid #2d2d2d",
                    borderRight: "1px solid #3a3a3a",
                    backgroundColor: "#1e1e1e"
                  }}
                >
                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      color: "#ffffff",
                      fontWeight: "normal",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {problem.name}
                  </a>
                </td>
                <td
                  className="text-center"
                  onClick={() =>
                    handleProblemClick(
                      selectedTopic.title,
                      problem.name
                    )
                  }
                  style={{ 
                    cursor: "pointer",
                    padding: "12px 15px",
                    borderBottom: "1px solid #2d2d2d",
                    borderRight: "1px solid #3a3a3a",
                    backgroundColor: isChecked ? "rgba(100, 255, 218, 0.1)" : "#1e1e1e"
                  }}
                >
                  {isChecked ? (
                    <Check size={24} style={{ color: "#64ffda" }} />
                  ) : (
                    <X size={24} style={{ color: "#ff5555" }} />
                  )}
                </td>
                <td 
                  className="text-center"
                  style={{ 
                    padding: "12px 15px",
                    borderBottom: "1px solid #2d2d2d",
                    backgroundColor: "#1e1e1e"
                  }}
                >
                  <Button
                    size="sm"
                    onClick={() =>
                      window.open(problem.link, "_blank")
                    }
                    className="d-flex align-items-center gap-1 mx-auto"
                    style={{
                      backgroundColor: "transparent",
                      border:  "1px solid #64ffda",
                      color: "#64ffda",
                      fontWeight: "500",
                      padding: "0.25rem 0.75rem",
                    }}
                  >
                    <BoxArrowUpRight size={14} style={{ color: '#64ffda' }} /> {isChecked ? "Solved":"Solve"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  </Card.Body>
</Card>
          </div>
        ) : (
          <div>
            <h1
              className="text-center mb-5"
              style={{
                color: "#ccd6f6",
                fontWeight: "700",
                marginBottom: "3rem",
                marginTop: "100px",
              
              }}
            >
              <span style={{ color: "#64ffda" }}>Code</span>Master Problems
            </h1>

            <Row xs={1} md={2} lg={3} className="g-4">
              {topics.map((topic, index) => {
                const solvedCount = topic.problems.filter(
                  (problem) => checkedProblems[topic.title]?.[problem.name]
                ).length;
                const progressPercentage = Math.round(
                  (solvedCount / topic.problems.length) * 100
                );

                return (
                  <Col key={index}>
                    <Card
                      style={{
                        backgroundColor: "#112240",
                        border: "none",
                        borderRadius: "8px",
                        height: "100%",
                        transition: "all 0.3s ease",
                        boxShadow: "0 10px 30px -15px rgba(2, 12, 27, 0.7)",
                        ":hover": {
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex align-items-center mb-3">
                          <span
                            style={{
                              fontSize: "2rem",
                              marginRight: "1rem",
                              color: "#64ffda",
                            }}
                          >
                            {topic.icon}
                          </span>
                          <Card.Title
                            style={{
                              marginBottom: 0,
                              color: "#ccd6f6",
                              fontWeight: "600",
                            }}
                          >
                            {topic.title}
                          </Card.Title>
                        </div>
                        <Card.Text
                          style={{
                            color: "#8892b0",
                            flexGrow: 1,
                          }}
                        >
                          {topic.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div>
                            <Badge
                              style={{
                                backgroundColor: "rgba(100, 255, 218, 0.1)",
                                color: "#ffffff",
                                marginRight: "0.5rem",
                                padding: "0.35rem 0.65rem",
                                fontWeight: "500",
                              }}
                            >
                              {solvedCount}/{topic.problems.length}
                            </Badge>
                            <Badge
                              style={{
                                backgroundColor: "rgba(136, 146, 176, 0.1)",
                                color: "#ffffff",
                                padding: "0.35rem 0.65rem",
                                fontWeight: "500",
                              }}
                            >
                              {progressPercentage}%
                            </Badge>
                          </div>
                          <Button
                            onClick={() => setSelectedTopic(topic)}
                            style={{
                              backgroundColor: "transparent",
                              borderColor: "#64ffda",
                              color: "#64ffda",
                              fontWeight: "500",
                              ":hover": {
                                backgroundColor: "rgba(100, 255, 218, 0.1)",
                              },
                            }}
                          >
                            View Problems
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
};

// Sample topics data (you should replace this with your actual data)
/*
const topics = [
  {
    title: "Arrays",
    icon: "📊",
    description: "Master array manipulation techniques and common patterns",
    problems: [
      { name: "Two Sum", link: "https://leetcode.com/problems/two-sum/" },
      { name: "Best Time to Buy and Sell Stock", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { name: "Contains Duplicate", link: "https://leetcode.com/problems/contains-duplicate/" },
      { name: "Product of Array Except Self", link: "https://leetcode.com/problems/product-of-array-except-self/" },
      { name: "Maximum Subarray", link: "https://leetcode.com/problems/maximum-subarray/" }
    ]
  },
  {
    title: "Strings",
    icon: "🔤",
    description: "Learn essential string operations and algorithms",
    problems: [
      { name: "Valid Palindrome", link: "https://leetcode.com/problems/valid-palindrome/" },
      { name: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { name: "Longest Palindromic Substring", link: "https://leetcode.com/problems/longest-palindromic-substring/" },
      { name: "Group Anagrams", link: "https://leetcode.com/problems/group-anagrams/" },
      { name: "Valid Parentheses", link: "https://leetcode.com/problems/valid-parentheses/" }
    ]
  },
  {
    title: "Linked Lists",
    icon: "⛓️",
    description: "Understand pointer manipulation and linked list operations",
    problems: [
      { name: "Reverse a Linked List", link: "https://leetcode.com/problems/reverse-linked-list/" },
      { name: "Detect Cycle in a Linked List", link: "https://leetcode.com/problems/linked-list-cycle/" },
      { name: "Merge Two Sorted Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { name: "Remove Nth Node From End of List", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
      { name: "Add Two Numbers", link: "https://leetcode.com/problems/add-two-numbers/" }
    ]
  },
  {
    title: "Trees",
    icon: "🌳",
    description: "Learn tree traversals and recursive algorithms",
    problems: [
      { name: "Maximum Depth of Binary Tree", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      { name: "Validate Binary Search Tree", link: "https://leetcode.com/problems/validate-binary-search-tree/" },
      { name: "Binary Tree Level Order Traversal", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { name: "Serialize and Deserialize Binary Tree", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
      { name: "Subtree of Another Tree", link: "https://leetcode.com/problems/subtree-of-another-tree/" }
    ]
  },
  {
    title: "Dynamic Programming",
    icon: "🧠",
    description: "Master memoization and tabulation techniques",
    problems: [
      { name: "Climbing Stairs", link: "https://leetcode.com/problems/climbing-stairs/" },
      { name: "Coin Change", link: "https://leetcode.com/problems/coin-change/" },
      { name: "Longest Increasing Subsequence", link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
      { name: "House Robber", link: "https://leetcode.com/problems/house-robber/" },
      { name: "Word Break", link: "https://leetcode.com/problems/word-break/" }
    ]
  },
  {
    title: "Graphs",
    icon: "🕸️",
    description: "Understand graph traversal and pathfinding algorithms",
    problems: [
      { name: "Number of Islands", link: "https://leetcode.com/problems/number-of-islands/" },
      { name: "Course Schedule", link: "https://leetcode.com/problems/course-schedule/" },
      { name: "Pacific Atlantic Water Flow", link: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
      { name: "Alien Dictionary", link: "https://leetcode.com/problems/alien-dictionary/" },
      { name: "Graph Valid Tree", link: "https://leetcode.com/problems/graph-valid-tree/" }
    ]
  }
];*/
const topics = [
  {
    icon: "🔠",
    title: "Strings",
    description: "Master string algorithms and pattern matching techniques.",
    problems: [
      {
        name: "Count and Say",
        link: "https://leetcode.com/problems/count-and-say/",
      },
      {
        name: "Implement Atoi",
        link: "https://www.geeksforgeeks.org/problems/implement-atoi/1",
      },
      {
        name: "Minimum Bracket Reversals",
        link: "https://www.geeksforgeeks.org/problems/count-the-reversals0401/1",
      },
      {
        name: "Rabin Karp Algorithm",
        link: "https://practice.geeksforgeeks.org/problems/search-pattern-rabin-karp-algorithm--141631/1",
      },
      {
        name: "Boyer Moore Algorithm",
        link: "https://www.codingninjas.com/studio/problems/boyer-moore-algorithm-for-pattern-searching_1115634",
      },
      {
        name: "KMP Algorithm (LPS)",
        link: "https://practice.geeksforgeeks.org/problems/longest-prefix-suffix2527/1",
      },
      {
        name: "Remove All Adjacent Duplicates",
        link: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/",
      },
      {
        name: "Hashing in Strings",
        link: "https://www.geeksforgeeks.org/practice-problems-on-hashing/",
      },
      {
        name: "Print All Anagrams",
        link: "https://leetcode.com/problems/group-anagrams/",
      },
      {
        name: "Z - Function",
        link: "https://practice.geeksforgeeks.org/problems/search-pattern-z-algorithm--141631/1",
      },
      {
        name: "Shortest Palindrome",
        link: "https://leetcode.com/problems/shortest-palindrome/description/",
      },
      {
        name: "Circle of Strings",
        link: "https://www.geeksforgeeks.org/problems/circle-of-strings4530/1",
      },
      {
        name: "Roman Numerals to Decimals",
        link: "https://www.geeksforgeeks.org/problems/roman-number-to-integer3201/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
    ],
  },

  {
    icon: "📌",
    title: "Arrays",
    description:
      "Learn about array manipulation techniques and common problems.",
    problems: [
      {
        name: "Find Maximum and Minimum Element in Array",
        link: "https://www.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4428/1",
      },
      {
        name: "Find Third Largest Element in Array",
        link: "https://practice.geeksforgeeks.org/problems/third-largest-element/1",
      },
      {
        name: "Search an Element in Array",
        link: "https://www.geeksforgeeks.org/problems/search-an-element-in-an-array-1587115621/1",
      },
      {
        name: "Find Missing Number in Array",
        link: "https://practice.geeksforgeeks.org/problems/missing-number-in-array1416/1",
      },
      {
        name: "Find Repeating Number in Array",
        link: "https://www.geeksforgeeks.org/problems/first-repeating-element4018/1",
      },
      {
        name: "Sort an Array of 0s, 1s, and 2s",
        link: "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Check if Two Arrays are Equal or Not",
        link: "https://www.geeksforgeeks.org/problems/check-if-two-arrays-are-equal-or-not3847/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Rotate the Array by 1",
        link: "https://www.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one2614/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Rotate the Array by k",
        link: "https://www.codingninjas.com/studio/problems/rotate-array_1230543",
      },
      {
        name: "Array Subset of Another Array",
        link: "https://www.geeksforgeeks.org/problems/array-subset-of-another-array2317/1",
      },
      {
        name: "Learn Map and How it is Represented",
        link: "https://www.geeksforgeeks.org/problems/map-operations/1?page=2&category=Map&sortBy=submissions",
      },
      {
        name: "Count Frequency of Elements in Array",
        link: "https://practice.geeksforgeeks.org/problems/frequency-of-array-elements-1587115620/1",
      },
      {
        name: "Find Pair with Given Sum",
        link: "https://www.geeksforgeeks.org/problems/key-pair5616/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "3 Sum",
        link: "https://www.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      { name: "4 Sum", link: "https://leetcode.com/problems/4sum/" },
      {
        name: "Find Triplets with Zero Sum",
        link: "https://www.geeksforgeeks.org/problems/find-triplets-with-zero-sum/1",
      },
      {
        name: "Find Count of Triplets",
        link: "https://www.geeksforgeeks.org/problems/count-the-triplets4615/1",
      },
      {
        name: "Union of Two Arrays",
        link: "https://www.geeksforgeeks.org/problems/union-of-two-arrays3538/1",
      },
      {
        name: "Intersection of Two Arrays",
        link: "https://www.geeksforgeeks.org/problems/intersection-of-two-arrays2404/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Remove Duplicates from Array",
        link: "https://www.geeksforgeeks.org/problems/remove-duplicate-elements-from-sorted-array/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Kth Element of Two Sorted Arrays",
        link: "https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Length of Longest Subarray with Sum k",
        link: "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=bottom_sticky_on_article",
      },
      {
        name: "Trapping Rain Water",
        link: "https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Majority Element",
        link: "https://leetcode.com/problems/majority-element/",
      },
      {
        name: "Kadane's Algorithm",
        link: "https://practice.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
      },
      {
        name: "Count Inversions",
        link: "https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1",
      },
      {
        name: "Merge Intervals",
        link: "https://leetcode.com/problems/merge-intervals/",
      },
      {
        name: "Maximum Product Subarray",
        link: "https://practice.geeksforgeeks.org/problems/maximum-product-subarray3604/1",
      },
      {
        name: "Next Permutation",
        link: "https://leetcode.com/problems/next-permutation/",
      },
      {
        name: "Sieve of Eratosthenes",
        link: "https://www.geeksforgeeks.org/problems/sieve-of-eratosthenes5242/1",
      },
    ],
  },

  {
    icon: "🔗",
    title: "Linked Lists",
    description: "Understand linked list operations and their applications.",
    problems: [
      {
        name: "Understand Linked List Node Representation",
        link: "https://www.geeksforgeeks.org/problems/linked-list-in-zig-zag-fashion/1",
      },
      {
        name: "Create, Insert, Delete Operations in LL",
        link: "https://www.geeksforgeeks.org/problems/operating-an-array/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
      },
      {
        name: "Search for an Element in LL",
        link: "https://www.geeksforgeeks.org/problems/search-in-linked-list-1664434326/1",
      },
      {
        name: "Reverse a Linked List",
        link: "https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1?page=1&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Check if Linked List is a Palindrome",
        link: "https://www.geeksforgeeks.org/problems/check-if-linked-list-is-pallindrome/1?page=1&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Middle Element of Linked List",
        link: "https://www.geeksforgeeks.org/problems/insert-in-middle-of-linked-list/1?page=2&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Find Intersection Point of Y Linked List",
        link: "https://www.geeksforgeeks.org/problems/intersection-point-in-y-shapped-linked-lists/1?page=1&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Union and Intersection of Linked List",
        link: "https://www.geeksforgeeks.org/problems/union-of-two-linked-list/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Delete Without Head Pointer",
        link: "https://www.geeksforgeeks.org/problems/delete-without-head-pointer/1?page=1&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Count Pairs with Given Sum",
        link: "https://www.geeksforgeeks.org/problems/count-pairs-whose-sum-is-equal-to-x/1?page=2&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Reverse LL in Groups of Given Size",
        link: "https://www.geeksforgeeks.org/problems/reverse-a-linked-list-in-groups-of-given-size/1?page=1&category=Linked%20List&sortBy=submissions",
      },

      // Loop-related problems
      {
        name: "Detect Loop in LL",
        link: "https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1?page=1&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Find Length of Loop in LL",
        link: "https://www.geeksforgeeks.org/problems/find-length-of-loop/1?page=1&category=Linked%20List&difficulty=Easy&sortBy=submissions",
      },
      {
        name: "Find Starting Point of Loop",
        link: "https://www.geeksforgeeks.org/problems/find-the-first-node-of-loop-in-linked-list--170645/1",
      },
      {
        name: "Remove the Loop",
        link: "https://www.geeksforgeeks.org/problems/remove-loop-in-linked-list/1?page=1&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Rotate Linked List",
        link: "https://www.geeksforgeeks.org/problems/reorder-list/1?page=3&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Flattening a Linked List",
        link: "https://www.geeksforgeeks.org/problems/flattening-a-linked-list--170645/1?page=4&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Delete Nodes Having Greater Value on Right",
        link: "https://practice.geeksforgeeks.org/problems/delete-nodes-having-greater-value-on-right/1",
      },
      {
        name: "Delete N Nodes After M Nodes",
        link: "https://www.geeksforgeeks.org/problems/delete-n-nodes-after-m-nodes-of-a-linked-list/1?page=3&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Delete All Occurrences of a Given Key in DLL",
        link: "https://www.naukri.com/code360/problems/delete-all-occurrences-of-a-given-key-in-a-doubly-linked-list_8160461",
      },
      {
        name: "Clone a Linked List with Next and Random Pointer",
        link: "https://www.geeksforgeeks.org/problems/clone-a-linked-list-with-next-and-random-pointer/1?page=1&category=Linked%20List&difficulty=Hard&sortBy=submissions",
      },
      {
        name: "Length of Longest Palindrome in Linked List",
        link: "https://www.geeksforgeeks.org/problems/length-of-longest-palindrome-in-linked-list/1?page=2&category=Linked%20List&difficulty=Medium&sortBy=submissions",
      },
      {
        name: "Basics of Circular Linked List",
        link: "https://www.techgig.com/practice/data-structure/circular-linked-list",
      },

      // Doubly Linked List Problems
      {
        name: "Nth Node from End of Linked List",
        link: "https://www.geeksforgeeks.org/problems/nth-node-from-end-of-linked-list/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
      },
      {
        name: "Reverse a Doubly Linked List",
        link: "https://www.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1?page=1&category=doubly-linked-list&sortBy=submissions",
      },
      {
        name: "Pairs with Given Sum in DLL",
        link: "https://www.geeksforgeeks.org/problems/find-pairs-with-given-sum-in-doubly-linked-list/1?page=1&category=doubly-linked-list&difficulty=Easy&sortBy=submissions",
      },
    ],
  },
  {
    icon: "🌳",
    title: "Trees",
    description: "Explore tree traversal techniques and common problems.",
    problems: [
      {
        name: "Determine if Two Trees are Identical",
        link: "https://www.geeksforgeeks.org/problems/determine-if-two-trees-are-identical/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
      },
      {
        name: "PreOrder Traversal",
        link: "https://www.geeksforgeeks.org/problems/preorder-traversal/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "InOrder Traversal",
        link: "https://www.geeksforgeeks.org/problems/inorder-traversal/1?page=2&category=Tree&sortBy=submissions",
      },
      {
        name: "PostOrder Traversal",
        link: "https://www.geeksforgeeks.org/problems/postorder-traversal/1?page=2&category=Tree&sortBy=submissions",
      },
      {
        name: "Level Order Traversal",
        link: "https://www.geeksforgeeks.org/problems/level-order-traversal/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Boundary Traversal",
        link: "https://www.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Vertical Traversal",
        link: "https://www.geeksforgeeks.org/problems/print-a-binary-tree-in-vertical-order/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Top View of Binary Tree",
        link: "https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Bottom View of Binary Tree",
        link: "https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Left View of Binary Tree",
        link: "https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Right View of Binary Tree",
        link: "https://www.geeksforgeeks.org/problems/right-view-of-binary-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Diagonal Traversal",
        link: "https://www.geeksforgeeks.org/problems/diagonal-traversal-of-binary-tree/1?page=3&category=Tree&sortBy=submissions",
      },
      {
        name: "Insert Node in a BST",
        link: "https://www.geeksforgeeks.org/problems/insert-a-node-in-a-bst/1",
      },
      {
        name: "Height of the Tree",
        link: "https://www.geeksforgeeks.org/problems/height-of-binary-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Diameter of the Tree",
        link: "https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Check if Two Trees are Identical",
        link: "https://www.geeksforgeeks.org/problems/determine-if-two-trees-are-identical/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Check if Subtree",
        link: "https://www.geeksforgeeks.org/problems/check-if-subtree/1?page=2&category=Tree&sortBy=submissions",
      },
      {
        name: "Check for Balanced Tree",
        link: "https://www.geeksforgeeks.org/problems/check-for-balanced-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Lowest Common Ancestor in Binary Tree",
        link: "https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-binary-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Sum Tree",
        link: "https://www.geeksforgeeks.org/problems/sum-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Symmetric Tree",
        link: "https://www.geeksforgeeks.org/problems/symmetric-tree/1?page=2&category=Tree&sortBy=submissions",
      },
      {
        name: "Mirror of a Tree",
        link: "https://www.geeksforgeeks.org/problems/mirror-tree/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Check if Tree is Isomorphic",
        link: "https://www.geeksforgeeks.org/problems/check-if-tree-is-isomorphic/1?page=2&category=Tree&sortBy=submissions",
      },
      {
        name: "Root to Leaf Paths",
        link: "https://www.geeksforgeeks.org/problems/root-to-leaf-paths/1?page=4&category=Tree&sortBy=submissions",
      },
      {
        name: "Root to Leaf Path Sum",
        link: "https://www.geeksforgeeks.org/problems/root-to-leaf-paths/1?page=4&category=Tree&sortBy=submissions",
      },
      {
        name: "Maximum Path Sum from Any Node",
        link: "https://www.geeksforgeeks.org/problems/maximum-path-sum-from-any-node/1?page=3&category=Tree&sortBy=submissions",
      },
      {
        name: "K Sum Paths",
        link: "https://www.geeksforgeeks.org/problems/k-sum-paths/1?page=3&category=Tree&sortBy=submissions",
      },
      {
        name: "Nodes at Given Distance",
        link: "https://www.geeksforgeeks.org/problems/nodes-at-given-distance-in-binary-tree/1?page=3&category=Tree&sortBy=submissions",
      },
      {
        name: "Range Sum of BST",
        link: "https://leetcode.com/problems/range-sum-of-bst/description/",
      },
      {
        name: "Minimum Distance Between Two Nodes",
        link: "https://www.geeksforgeeks.org/problems/min-distance-between-two-given-nodes-of-a-binary-tree/1?page=2&category=Tree&sortBy=submissions",
      },
      {
        name: "Maximum Distance Between Node and Ancestor",
        link: "https://www.geeksforgeeks.org/problems/maximum-difference-between-node-and-its-ancestor/1?page=3&category=Tree&sortBy=submissions",
      },
      {
        name: "Min Time to Burn a Tree",
        link: "https://www.geeksforgeeks.org/problems/burning-tree/1?page=4&category=Tree&sortBy=submissions",
      },
      {
        name: "Check for BST",
        link: "https://www.geeksforgeeks.org/problems/check-for-bst/1",
      },
      {
        name: "Insert a Node in BST",
        link: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
      },
      {
        name: "Search a Value in BST",
        link: "https://practice.geeksforgeeks.org/problems/search-a-node-in-bst/1",
      },
      {
        name: "Find Minimum and Maximum in BST",
        link: "https://www.geeksforgeeks.org/problems/max-and-min-element-in-binary-tree/1?page=5&category=Tree&sortBy=submissions",
      },
      {
        name: "Kth Largest/Smallest Element in BST",
        link: "https://www.geeksforgeeks.org/problems/kth-largest-element-in-bst/1?page=2&category=Tree&sortBy=submissions",
      },
      {
        name: "Find the Closest Element in BST",
        link: "https://www.geeksforgeeks.org/problems/find-the-closest-element-in-bst/1?page=3&category=Tree&sortBy=submissions",
      },
      {
        name: "Count BST Nodes in Given Range",
        link: "https://www.geeksforgeeks.org/problems/count-bst-nodes-that-lie-in-a-given-range/1?page=3&category=Tree&sortBy=submissions",
      },
      {
        name: "Largest BST in Binary Tree",
        link: "https://www.geeksforgeeks.org/problems/largest-bst/1?page=2&category=Tree&sortBy=submissions",
      },
      {
        name: "Lowest Common Ancestor in BST",
        link: "https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-bst/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Merge Two BSTs",
        link: "https://www.geeksforgeeks.org/problems/merge-two-bst-s/1?page=4&category=Tree&sortBy=submissions",
      },
      {
        name: "Inorder Successor and Predecessor",
        link: "https://www.geeksforgeeks.org/problems/predecessor-and-successor/1?page=2&category=Tree&sortBy=submissions",
      },
      {
        name: "Populate Inorder Successor for All Nodes",
        link: "https://www.geeksforgeeks.org/problems/populate-inorder-successor-for-all-nodes/1?page=5&category=Tree&sortBy=submissions",
      },
      {
        name: "BST to Greater Sum Tree",
        link: "https://www.geeksforgeeks.org/problems/bst-to-greater-sum-tree/1?page=8&category=Tree&sortBy=submissions",
      },
      {
        name: "Delete Given Node from BST",
        link: "https://leetcode.com/problems/delete-node-in-a-bst/",
      },
      {
        name: "Construct Binary Tree from Preorder and Inorder",
        link: "https://www.geeksforgeeks.org/problems/construct-tree-1/1?page=1&category=Tree&sortBy=submissions",
      },
      {
        name: "Construct Binary Tree from Inorder and Postorder",
        link: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
      },
      {
        name: "Construct BST from Given Preorder",
        link: "https://www.geeksforgeeks.org/problems/construct-tree-from-preorder-traversal/1?page=7&category=Tree&sortBy=submissions",
      },
      {
        name: "Construct Binary Tree from Parent Array",
        link: "https://www.geeksforgeeks.org/problems/construct-binary-tree-from-parent-array/1?page=5&category=Tree&sortBy=submissions",
      },
      {
        name: "Serialize and Deserialize Binary Tree",
        link: "https://www.geeksforgeeks.org/problems/serialize-and-deserialize-a-binary-tree/1?page=4&category=Tree&sortBy=submissions",
      },
      {
        name: "Largest Subtree Sum in a Tree",
        link: "https://www.geeksforgeeks.org/problems/largest-subtree-sum-in-a-tree/1?page=6&category=Tree&sortBy=submissions",
      },
      {
        name: "Maximum Sum of Non-Adjacent Nodes",
        link: "https://www.geeksforgeeks.org/problems/maximum-sum-of-non-adjacent-nodes/1?page=3&category=Tree&sortBy=submissions",
      },
      {
        name: "Duplicate Subtree",
        link: "https://www.geeksforgeeks.org/problems/duplicate-subtrees/1?page=4&category=Tree&sortBy=submissions",
      },
      {
        name: "Flatten Binary Tree to Linked List",
        link: "https://www.geeksforgeeks.org/problems/flatten-binary-tree-to-linked-list/1?page=5&category=Tree&sortBy=submissions",
      },
    ],
  },

  {
    icon: "🔗",
    title: "Graphs",
    description:
      "Dive into graph algorithms like DFS, BFS, and shortest paths.",
    problems: [
      {
        name: "Number of Provinces",
        link: "https://www.geeksforgeeks.org/problems/number-of-provinces/1?page=2&category=Graph&sortBy=submissions",
      },
      {
        name: "Number of Islands",
        link: "https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Number of Distinct Islands",
        link: "https://www.geeksforgeeks.org/problems/number-of-distinct-islands/1?page=2&category=Graph&sortBy=submissions",
      },
      {
        name: "Number of Closed Islands",
        link: "https://www.geeksforgeeks.org/problems/find-number-of-closed-islands/1?page=3&category=Graph&sortBy=submissions",
      },

      {
        name: "Bipartite Graph",
        link: "https://www.geeksforgeeks.org/problems/bipartite-graph/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "M-Coloring",
        link: "https://practice.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1",
      },

      {
        name: "Find Shortest Path in UG",
        link: "https://www.codingninjas.com/studio/problems/shortest-path-in-an-unweighted-graph_981297",
      },
      {
        name: "Find Shortest Path in DAG",
        link: "https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Dijkstra's Algorithm",
        link: "https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Step by Knight",
        link: "https://www.geeksforgeeks.org/problems/steps-by-knight5927/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Shortest Path Source to Destination",
        link: "https://www.geeksforgeeks.org/problems/shortest-source-to-destination-path3544/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Find if Path Exists",
        link: "https://www.geeksforgeeks.org/problems/find-whether-path-exist5238/1?page=2&category=Graph&sortBy=submissions",
      },
      {
        name: "Covid Spread",
        link: "https://www.geeksforgeeks.org/problems/covid-spread--141631/1?page=4&category=Graph&sortBy=submissions",
      },
      {
        name: "Minimum Cost Path",
        link: "https://www.geeksforgeeks.org/problems/minimum-cost-path3833/1?page=2&category=Graph&sortBy=submissions",
      },
      {
        name: "Word Ladder I",
        link: "https://www.geeksforgeeks.org/problems/word-ladder/1?page=3&category=Graph&sortBy=submissions",
      },
      {
        name: "Word Ladder II",
        link: "https://www.geeksforgeeks.org/problems/word-ladder-ii/1?page=3&category=Graph&sortBy=submissions",
      },
      {
        name: "Floyd Warshall Algorithm",
        link: "https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Bellman-Ford Algorithm",
        link: "https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1?page=2&category=Graph&sortBy=submissions",
      },

      {
        name: "Flood Fill",
        link: "https://www.geeksforgeeks.org/problems/flood-fill-algorithm1856/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Replace O's with X's",
        link: "https://www.geeksforgeeks.org/problems/replace-os-with-xs0052/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Unit Area of Largest Region of 1s",
        link: "https://www.geeksforgeeks.org/problems/length-of-largest-region-of-1s-1587115620/1?page=2&category=Graph&sortBy=submissions",
      },
      {
        name: "Rotten Oranges",
        link: "https://www.geeksforgeeks.org/problems/rotten-oranges2536/1?page=1&category=Graph&sortBy=submissions",
      },

      {
        name: "Topological Sort",
        link: "https://www.geeksforgeeks.org/problems/topological-sort/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Prerequisite Tasks",
        link: "https://www.geeksforgeeks.org/problems/prerequisite-tasks/1?page=2&category=Graph&sortBy=submissions",
      },
      {
        name: "Course Schedule I",
        link: "https://www.geeksforgeeks.org/problems/course-schedule/1?page=3&category=Graph&sortBy=submissions",
      },
      {
        name: "Course Schedule II",
        link: "https://leetcode.com/problems/course-schedule-ii",
      },
      {
        name: "Eventual Safe States",
        link: "https://www.geeksforgeeks.org/problems/eventual-safe-states/1?page=2&category=Graph&sortBy=submissions",
      },
      {
        name: "Alien Dictionary",
        link: "https://www.geeksforgeeks.org/problems/alien-dictionary/1?page=1&category=Graph&sortBy=submissions",
      },

      {
        name: "Minimum Spanning Tree",
        link: "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Kruskal's Algorithm",
        link: "https://www.codingninjas.com/studio/problems/code-kruskal-s-algorithm_6320",
      },
      {
        name: "Minimum Cost to Connect Cities",
        link: "https://leetcode.com/problems/connecting-cities-with-minimum-cost",
      },
      {
        name: "Minimum Cost to Connect All Points",
        link: "https://leetcode.com/problems/min-cost-to-connect-all-points/",
      },
      {
        name: "Optimize Water Distribution",
        link: "https://leetcode.com/problems/optimize-water-distribution-in-a-village",
      },

      {
        name: "Disjoint Set (Union-Find)",
        link: "https://www.geeksforgeeks.org/problems/disjoint-set-union-find/0",
      },
      {
        name: "Union by Rank, Path Compression",
        link: "https://leetcode.com/problems/number-of-provinces/solutions/1924642/java-disjoint-set-union-by-rank-path-compression/",
      },
      {
        name: "Networks Connected",
        link: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
      },
      {
        name: "Minimum Swaps to Sort",
        link: "https://www.geeksforgeeks.org/problems/minimum-swaps/1?page=1&category=Graph&sortBy=submissions",
      },
      {
        name: "Santa Banta",
        link: "https://www.geeksforgeeks.org/problems/santa-banta2814/1?page=3&category=Graph&sortBy=submissions",
      },
      {
        name: "Number of Pairs",
        link: "https://www.geeksforgeeks.org/problems/number-of-pairs-1645358985/1?page=5&category=Graph&sortBy=submissions",
      },
      {
        name: "Number of Islands II",
        link: "https://leetcode.com/problems/number-of-islands-ii/",
      },
      {
        name: "Making a Large Island",
        link: "https://leetcode.com/problems/making-a-large-island",
      },

      {
        name: "Bridges in Graph",
        link: "https://www.geeksforgeeks.org/problems/bridge-edge-in-graph/1?page=3&category=Graph&sortBy=submissions",
      },
      {
        name: "Articulation Point",
        link: "https://www.geeksforgeeks.org/problems/articulation-point-1/1?page=3&category=Graph&sortBy=submissions",
      },
      {
        name: "Critical Connection",
        link: "https://www.geeksforgeeks.org/problems/critical-connections/1?page=5&category=Graph&sortBy=submissions",
      },
      {
        name: "Kosaraju's Algorithm (SCC)",
        link: "https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1?page=2&category=Graph&sortBy=submissions",
      },
    ],
  },

  {
    icon: "📈",
    title: "Dynamic Programming",
    description: "Learn DP concepts and optimization strategies.",

    problems: [
      {
        name: "Count Number of Hops",
        link: "https://www.geeksforgeeks.org/problems/count-number-of-hops-1587115620/1?page=2&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Count Ways to Reach the Nth Stair (Order Matters)",
        link: "https://www.geeksforgeeks.org/problems/count-ways-to-reach-the-nth-stair-1587115620/1?page=2&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Count Ways to Reach the Nth Stair (Order Doesn't Matter)",
        link: "https://www.geeksforgeeks.org/problems/count-ways-to-nth-stairorder-does-not-matter5639/1?page=4&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "House Robber",
        link: "https://leetcode.com/problems/house-robber/",
      },
      {
        name: "House Robber II",
        link: "https://leetcode.com/problems/house-robber-ii/",
      },

      {
        name: "Count Paths - Grid",
        link: "https://www.geeksforgeeks.org/problems/count-the-paths4332/1?page=5&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Unique Paths II",
        link: "https://leetcode.com/problems/unique-paths-ii/",
      },
      {
        name: "Count All Possible Paths with Condition",
        link: "https://www.geeksforgeeks.org/problems/count-all-possible-paths-from-top-left-to-bottom-right3011/1?page=3&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Minimum Path Sum in Grid",
        link: "https://leetcode.com/problems/minimum-path-sum/",
      },
      {
        name: "Maximum Path Sum",
        link: "https://www.geeksforgeeks.org/problems/path-in-matrix3805/1?page=2&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Minimum Path Sum in Triangular Grid",
        link: "https://leetcode.com/problems/triangle/",
      },
      {
        name: "Number of Paths with K Coins",
        link: "https://www.geeksforgeeks.org/problems/number-of-paths-in-a-matrix-with-k-coins2728/1?page=7&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Minimum Falling Path Sum",
        link: "https://leetcode.com/problems/minimum-falling-path-sum",
      },
      {
        name: "Minimum Falling Path Sum II",
        link: "https://leetcode.com/problems/minimum-falling-path-sum-ii",
      },

      {
        name: "Subset Sum Problem",
        link: "https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1?page=1&category=Dynamic%20Programming&status=solved&sortBy=submissions",
      },
      {
        name: "Count Subset with Given Sum K",
        link: "https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1?page=1&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Partition Equal Subset Sum",
        link: "https://www.geeksforgeeks.org/problems/subset-sum-problem2014/1?page=1&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Minimum Sum Partition",
        link: "https://www.geeksforgeeks.org/problems/minimum-sum-partition3317/1?page=2&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Count Partition with Given Difference",
        link: "https://leetcode.com/discuss/post/6250271/dp-partitions-with-given-difference-top-mu353/",
      },
      {
        name: "0-1 Knapsack",
        link: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1?page=1&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Maximum Non-Adjacent Subsequence",
        link: "https://www.geeksforgeeks.org/problems/max-sum-without-adjacents2430/1?page=3&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Coin Change",
        link: "https://www.geeksforgeeks.org/problems/coin-change2448/1?page=1&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Minimum Number of Coins",
        link: "https://www.geeksforgeeks.org/problems/number-of-coins1824/1?page=2&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Rod Cutting",
        link: "https://www.geeksforgeeks.org/problems/rod-cutting0840/1?page=2&category=Dynamic%20Programming&status=solved&sortBy=submissions",
      },
      { name: "Target Sum", link: "https://leetcode.com/problems/target-sum" },
      {
        name: "Minimum Cost to Fill Given Weight in Bag",
        link: "https://www.geeksforgeeks.org/problems/minimum-cost-to-fill-given-weight-in-a-bag1956/1?page=3&category=Dynamic%20Programming&status=solved&sortBy=submissions",
      },
      {
        name: "Knapsack with Duplicate Items",
        link: "https://www.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1?page=2&category=Dynamic%20Programming&sortBy=submissions",
      },

      {
        name: "Longest Increasing Subsequence",
        link: "https://leetcode.com/problems/longest-increasing-subsequence/",
      },
      {
        name: "Print Longest Increasing Subsequence",
        link: "https://www.geeksforgeeks.org/problems/printing-longest-increasing-subsequence/0",
      },
      {
        name: "Longest Bitonic Subsequence",
        link: "https://www.geeksforgeeks.org/problems/longest-bitonic-subsequence0824/1?page=4&category=Dynamic%20Programming&sortBy=submissions",
      },
      {
        name: "Longest Divisible Subset",
        link: "https://leetcode.com/problems/largest-divisible-subset/",
      },
      {
        name: "Longest String Chain",
        link: "https://leetcode.com/problems/longest-string-chain/",
      },
      {
        name: "Number of Longest Increasing Subsequences",
        link: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
      },
    ],
  },

  {
    icon: "📌",
    title: "Stack",
    description: "Learn stack operations and their use cases.",
    problems: [
      {
        name: "Rotate LL",
        link: "https://www.geeksforgeeks.org/problems/reorder-list/1?page=3&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Flattening a LL",
        link: "https://www.geeksforgeeks.org/problems/flattening-a-linked-list--170645/1?page=4&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Delete nodes having greater value on right",
        link: "https://practice.geeksforgeeks.org/problems/delete-nodes-having-greater-value-on-right/1",
      },
      {
        name: "Delete N nodes after M nodes",
        link: "https://www.geeksforgeeks.org/problems/delete-n-nodes-after-m-nodes-of-a-linked-list/1?page=3&category=Linked%20List&sortBy=submissions",
      },
      {
        name: "Delete all occurrence of node",
        link: "https://www.naukri.com/code360/problems/delete-all-occurrences-of-a-given-key-in-a-doubly-linked-list_8160461",
      },
      {
        name: "Clone a LL",
        link: "https://www.geeksforgeeks.org/problems/clone-a-linked-list-with-next-and-random-pointer/1?page=1&category=Linked%20List&difficulty=Hard&sortBy=submissions",
      },
      {
        name: "Length of longest palindrome in LL",
        link: "https://www.geeksforgeeks.org/problems/length-of-longest-palindrome-in-linked-list/1?page=2&category=Linked%20List&difficulty=Medium&sortBy=submissions",
      },
      {
        name: "Learn the basics of circular LL",
        link: "https://www.techgig.com/practice/data-structure/circular-linked-list",
      },

      {
        name: "Learn the basic representation of the nodes in LL",
        link: "https://www.geeksforgeeks.org/problems/nth-node-from-end-of-linked-list/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
      },
      {
        name: "Insert, Delete, Reverse DLL",
        link: "https://www.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1?page=1&category=doubly-linked-list&sortBy=submissions",
      },
      {
        name: "Pairs with given sum in DLL",
        link: "https://www.geeksforgeeks.org/problems/find-pairs-with-given-sum-in-doubly-linked-list/1?page=1&category=doubly-linked-list&difficulty=Easy&sortBy=submissions",
      },
    ],
  },

  {
    icon: "📤",
    title: "Queue",
    description: "Understand queue structures and their applications.",
    problems: [
      {
        name: "What is Queue? Learn the basic representation and how it's implemented",
        link: "https://www.geeksforgeeks.org/queue-data-structure/",
      },
      {
        name: "Implement Queue using Linked List",
        link: "https://www.geeksforgeeks.org/problems/implement-queue-using-linked-list/1?page=1&category=Queue&sortBy=submissions",
      },
      {
        name: "Implement Queue using Stack (Super Important)",
        link: "https://www.geeksforgeeks.org/problems/queue-using-two-stacks/1?page=1&category=Queue&sortBy=submissions",
      },
      {
        name: "Implement Stack using Queue (Super Important)",
        link: "https://www.geeksforgeeks.org/problems/implement-stack-using-queue/1?page=1&category=Queue&sortBy=submissions",
      },
      {
        name: "Reverse a Queue",
        link: "https://www.geeksforgeeks.org/problems/reverse-first-k-elements-of-queue/1?page=1&category=Queue&sortBy=submissions",
      },

      {
        name: "Circular Tour",
        link: "https://www.geeksforgeeks.org/problems/circular-tour/1?page=1&category=Queue&sortBy=submissions",
      },
      {
        name: "First Non-Repeating Character in a Stream",
        link: "https://www.geeksforgeeks.org/problems/first-non-repeating-character-in-a-stream/1?page=1&category=Queue&sortBy=submissions",
      },
      {
        name: "Reverse First K Elements in Queue",
        link: "https://www.geeksforgeeks.org/problems/reverse-first-k-elements-of-queue/1?page=1&category=Queue&sortBy=submissions",
      },
      {
        name: "LRU Cache (Super Important)",
        link: "https://www.geeksforgeeks.org/problems/lru-cache/1?page=1&category=Queue&sortBy=submissions",
      },
      {
        name: "Minimum Cost of Ropes",
        link: "https://www.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1?page=1&category=Queue&sortBy=submissions",
      },
      {
        name: "Nearly Sorted (Learn Priority Queue for Sure)",
        link: "https://www.geeksforgeeks.org/problems/nearly-sorted-1587115620/1?page=1&category=Queue&sortBy=submissions",
      },
    ],
  },

  {
    icon: "🔍",
    title: "Binary Search",
    description: "Master binary search and its variations.",
    problems: [
      {
        name: "Search in a Sorted Array (Efficiently -> So Learn Binary Search for This)",
        link: "https://www.geeksforgeeks.org/problems/who-will-win-1587115621/1?page=1&category=Binary%20Search&sortBy=submissions",
      },
      {
        name: "Find Floor and Ceil in Sorted Array",
        link: "https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115620/1",
      },
      {
        name: "Find First and Last Occurrence of Element in Sorted Array",
        link: "https://www.geeksforgeeks.org/problems/first-and-last-occurrences-of-x3116/1?page=1&category=Binary%20Search&sortBy=submissions",
      },
      {
        name: "Find Missing Number from 1 to N",
        link: "https://leetcode.com/problems/missing-number/",
      },
      {
        name: "Find Square Root",
        link: "https://www.geeksforgeeks.org/problems/square-root/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Search for Element in Infinite Array",
        link: "https://www.codingninjas.com/studio/problems/search-in-infinite-sorted-0-1-array_696193",
      },

      {
        name: "Search Element in Sorted Rotated Array (With and Without Duplicate)",
        link: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
      },
      {
        name: "Minimum Element in Sorted Rotated Array (With and Without Duplicate)",
        link: "https://www.geeksforgeeks.org/problems/minimum-number-in-a-sorted-rotated-array-1587115620/1?page=1&category=Binary%20Search&sortBy=submissions",
      },
      {
        name: "Number of Times Array is Sorted",
        link: "https://www.geeksforgeeks.org/problems/rotation4723/1?itm_source=geeksforgeeks&itm_medium=Article&itm_campaign=bottom_sticky_on_Article",
      },
      {
        name: "Maximum Element in Sorted Rotated Array",
        link: "https://www.issacc.com/find-minimum-in-rotated-sorted-array/",
      },
    ],
  },

  {
    icon: "🚪",
    title: "Sliding Window",
    description:
      "Learn efficient techniques for handling window-based problems.",
    problems: [
      {
        name: "Subarray with Given Sum",
        link: "https://www.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1?page=1&category=sliding-window&sortBy=submissions",
      },
      {
        name: "Longest Subarray with Given Sum K (Same as Above with Slight Modification)",
        link: "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1?page=1&category=sliding-window&sortBy=submissions",
      },
      {
        name: "Subarray with 0 Sum",
        link: "https://www.geeksforgeeks.org/problems/subarray-with-0-sum-1587115621/1?page=1&category=sliding-window&sortBy=submissions",
      },
      {
        name: "Smallest Window of Distinct Elements",
        link: "https://www.geeksforgeeks.org/problems/smallest-distant-window3132/1?page=1&category=sliding-window&sortBy=submissions",
      },
      {
        name: "Smallest Window Containing 0,1,2",
        link: "https://www.geeksforgeeks.org/problems/smallest-window-containing-0-1-and-2--170637/1?page=2&category=sliding-window&sortBy=submissions",
      },
      {
        name: "Smallest Window in String Containing All Chars of Another String",
        link: "https://www.geeksforgeeks.org/problems/smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621/1?page=1&category=sliding-window&sortBy=submissions",
      },
      {
        name: "Length of Longest Substring",
        link: "https://www.geeksforgeeks.org/problems/length-of-the-longest-substring3036/1?page=1&category=sliding-window&sortBy=submissions",
      },
      {
        name: "Largest Subarray of 0s and 1s",
        link: "https://www.geeksforgeeks.org/problems/largest-subarray-of-0s-and-1s/1?page=1&category=sliding-window&sortBy=submissions",
      },
      {
        name: "Count of Anagram Occurrences (Super Important)",
        link: "https://www.geeksforgeeks.org/problems/count-occurences-of-anagrams5839/1?page=1&category=sliding-window&sortBy=submissions",
      },
      {
        name: "Max Consecutive Ones III",
        link: "https://leetcode.com/problems/max-consecutive-ones-iii/",
      },
      {
        name: "Fruit into Baskets",
        link: "https://leetcode.com/problems/fruit-into-baskets",
      },
      {
        name: "Count Number of Nice Subarrays",
        link: "https://leetcode.com/problems/count-number-of-nice-subarrays/",
      },
      {
        name: "Longest Repeating Character Replacement",
        link: "https://leetcode.com/problems/longest-repeating-character-replacement",
      },
      {
        name: "Minimum Window Substring",
        link: "https://leetcode.com/problems/minimum-window-substring/description/",
      },
      {
        name: "Minimum Window Subsequence (Understand the Difference Between Subarray and Subsequence Before Starting This)",
        link: "https://leetcode.com/problems/minimum-window-subsequence/",
      },
      {
        name: "Subarray with K Different Integers",
        link: "https://leetcode.com/problems/subarrays-with-k-different-integers/",
      },
    ],
  },

  {
    icon: "🔙",
    title: "Backtracking",
    description: "Explore recursive solutions for combinatorial problems.",
    problems: [
      {
        name: "Permutations of a String",
        link: "https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Permutation II (You Can Solve on Your Own Once You Solve Above)",
        link: "https://leetcode.com/problems/permutations-ii",
      },
      {
        name: "Combination Sum I",
        link: "https://www.geeksforgeeks.org/problems/combination-sum-1587115620/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Combination Sum II (Once You Solve Combination I, You Should Be Able to Solve This and Below 2 Problems Too Easily)",
        link: "https://leetcode.com/problems/combination-sum-ii",
      },
      {
        name: "Combination Sum III",
        link: "https://leetcode.com/problems/combination-sum-iii",
      },
      {
        name: "Rat in a Maze (Once Above Problems Are Solved, You Can Do This Easily)",
        link: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Possible Words from Phone Digits",
        link: "https://www.geeksforgeeks.org/problems/possible-words-from-phone-digits-1587115620/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Subsets",
        link: "https://www.geeksforgeeks.org/problems/subsets-1613027340/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Unique Subsets (Solving Above, You Will Be Able to Solve This Easily)",
        link: "https://www.geeksforgeeks.org/problems/subsets-1587115621/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "N-Queen (Super Important)",
        link: "https://www.geeksforgeeks.org/problems/n-queen-problem0315/1?page=1&category=Backtracking&sortBy=submissions",
      },
      { name: "N-Queen II", link: "https://leetcode.com/problems/n-queens-ii" },
      {
        name: "Permutation with Spaces",
        link: "https://www.geeksforgeeks.org/problems/permutation-with-spaces3627/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Generate Parentheses",
        link: "https://www.geeksforgeeks.org/problems/generate-all-possible-parentheses/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Generate IP Addresses",
        link: "https://www.geeksforgeeks.org/problems/generate-ip-addresses/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Solve the Sudoku",
        link: "https://www.geeksforgeeks.org/problems/solve-the-sudoku-1587115621/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Kth Permutation",
        link: "https://www.geeksforgeeks.org/problems/find-kth-permutation/1?page=2&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Word Search",
        link: "https://www.geeksforgeeks.org/problems/word-search/1?page=3&category=Graph&sortBy=submissions",
      },
      {
        name: "Palindrome Partition of String",
        link: "https://www.geeksforgeeks.org/problems/find-all-possible-palindromic-partitions-of-a-string/1?page=2&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Decode the String",
        link: "https://www.geeksforgeeks.org/problems/decode-the-string2444/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Letter Case Permutation",
        link: "https://leetcode.com/problems/letter-case-permutation/",
      },
      {
        name: "Sum String",
        link: "https://www.geeksforgeeks.org/problems/sum-string3151/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Word Boggle",
        link: "https://www.geeksforgeeks.org/problems/word-boggle4143/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Largest Number in K Swaps",
        link: "https://www.geeksforgeeks.org/problems/largest-number-in-k-swaps-1587115620/1?page=1&category=Backtracking&sortBy=submissions",
      },
      {
        name: "Partition Array to K Subsets",
        link: "https://www.geeksforgeeks.org/problems/partition-array-to-k-subsets/1?page=1&category=Backtracking&sortBy=submissions",
      },
    ],
  },

  {
    icon: "💰",
    title: "Greedy",
    description:
      "Understand greedy algorithms and their problem-solving approach.",
    problems: [
      {
        name: "Minimum Number of Jumps",
        link: "https://www.geeksforgeeks.org/problems/minimum-number-of-jumps-1587115620/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Minimum Operations",
        link: "https://www.geeksforgeeks.org/problems/find-optimum-operation4504/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Minimize the Sum of Product",
        link: "https://www.geeksforgeeks.org/problems/minimize-the-sum-of-product1525/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Largest Number Possible",
        link: "https://www.geeksforgeeks.org/problems/largest-number-possible5028/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Lemonade Change",
        link: "https://www.geeksforgeeks.org/problems/lemonade-change/1?page=2&category=Greedy&sortBy=submissions",
      },
      {
        name: "Activity Selection Problem (Super Important)",
        link: "https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "N Meetings in a Room (Super Important)",
        link: "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Minimum Platforms",
        link: "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Minimize the Height",
        link: "https://www.geeksforgeeks.org/problems/minimize-the-heights-i/1?page=2&category=Greedy&sortBy=submissions",
      },
      {
        name: "Minimum Number of Coins Using Greedy (This Can Be Solved Using Naive, DP Also but Make Sure to Use Greedy Here)",
        link: "https://www.geeksforgeeks.org/problems/-minimum-number-of-coins4426/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Job Sequencing Problem",
        link: "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Fractional Knapsack",
        link: "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Jump Game",
        link: "https://www.geeksforgeeks.org/problems/jump-game/1?page=2&category=Greedy&sortBy=submissions",
      },
      {
        name: "Insert Interval",
        link: "https://leetcode.com/problems/insert-interval/",
      },
      {
        name: "Merge Intervals",
        link: "https://leetcode.com/problems/merge-intervals/",
      },
      {
        name: "Non-Overlapping Intervals",
        link: "https://leetcode.com/problems/non-overlapping-intervals/",
      },
      {
        name: "Minimum Cost of Ropes",
        link: "https://practice.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1",
      },
      {
        name: "Partition Labels",
        link: "https://leetcode.com/problems/partition-labels/",
      },
      {
        name: "Cinema Seat Allocation",
        link: "https://leetcode.com/problems/cinema-seat-allocation/",
      },
      {
        name: "Max Length Chain",
        link: "https://www.geeksforgeeks.org/problems/max-length-chain/1?page=1&category=Greedy&sortBy=submissions",
      },
      {
        name: "Valid Parentheses - Minimum",
        link: "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
      },
      {
        name: "Shortest Job First",
        link: "https://practice.geeksforgeeks.org/problems/shortest-job-first/1",
      },
      {
        name: "Least Recently Used (LRU Cache)",
        link: "https://practice.geeksforgeeks.org/problems/lru-cache/1?utm_source=youtube&utm_medium=collab_fraz_websitelink&utm_campaign=LRU+Cache",
      },
    ],
  },
];

export default ProblemPage;
