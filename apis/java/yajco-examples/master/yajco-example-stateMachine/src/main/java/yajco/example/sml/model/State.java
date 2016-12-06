package yajco.example.sml.model;

import java.util.HashSet;
import java.util.Set;
import yajco.annotation.After;
import yajco.annotation.Before;
import yajco.annotation.Token;
import yajco.annotation.reference.Identifier;

public class State extends Declaration {
    @Identifier(unique="XXX")
    private final String label;

    private final Set<Transition> outgoingTransitions = new HashSet<Transition>();
    private final Set<Transition> incomingTransitions = new HashSet<Transition>();

    @Before("state")
    @After(";")
    public State(@Token("ID") String id) {
        this.label = id;
    }

    public String getLabel() {
        return label;
    }

    public Set<Transition> getIncomingTransitions() {
        return incomingTransitions;
    }

    public Set<Transition> getOutgoingTransitions() {
        return outgoingTransitions;
    }

    @Override
    public String toString() {
        StringBuilder outgoing = new StringBuilder();
        StringBuilder incoming = new StringBuilder();
        for (Transition transition : outgoingTransitions) {
            outgoing.append(transition.getLabel());
            outgoing.append(" ");
        }
        for (Transition transition : incomingTransitions) {
            incoming.append(transition.getLabel());
            incoming.append(" ");
        }
        return String.format("state %s [outgoingTrans: %s; incomingTrans: %s];", label,outgoing.toString(),incoming.toString());
    }
}
