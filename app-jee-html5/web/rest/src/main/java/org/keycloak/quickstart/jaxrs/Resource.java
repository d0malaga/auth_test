/*
 * JBoss, Home of Professional Open Source
 * Copyright 2016, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.keycloak.quickstart.jaxrs;

// import org.eclipse.microprofile.metrics.Counter;
// import org.eclipse.microprofile.metrics.Metadata;
// import org.eclipse.microprofile.metrics.MetricRegistry;
import org.eclipse.microprofile.metrics.MetricUnits;
// import org.eclipse.microprofile.metrics.annotation.ConcurrentGauge;
import org.eclipse.microprofile.metrics.annotation.Counted;
// import org.eclipse.microprofile.metrics.annotation.Gauge;
import org.eclipse.microprofile.metrics.annotation.Metered;
// import org.eclipse.microprofile.metrics.annotation.Metric;
// import org.eclipse.microprofile.metrics.annotation.RegistryType;
import org.eclipse.microprofile.metrics.annotation.Timed;

import javax.enterprise.context.ApplicationScoped;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;

@Path("/")
@ApplicationScoped
public class Resource {

    void randomDelay(float min, float max){
        int random = (int)(max * Math.random() + min);
        try {
          Thread.sleep(random * 1000);
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Counted(name = "performedPublic", displayName="Performed public calls", description = "How many public calls have been performed.")
    @Timed(name = "publicTimer", absolute = true, description = "A measure of how long it takes to perform the public call.", unit = MetricUnits.MILLISECONDS)
    @Metered(name = "publicFrequency", absolute = true)
    @Path("public")
    public Message getPublic(@Context HttpHeaders header, @Context HttpServletResponse response){
        response.setHeader("Access-Control-Allow-Origin", "*");
        randomDelay(1,3);
        return new Message("public");
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Counted(name = "performedSecured", displayName="Performed secured calls", description = "How many public calls have been performed.")
    @Timed(name = "securedTimer", absolute = true, description = "A measure of how long it takes to perform the secured call.", unit = MetricUnits.MILLISECONDS)
    @Metered(name = "securedFrequency", absolute = true)
    @Path("secured")
    public Message getSecured() {
        randomDelay(0,1);
        return new Message("secured");
    }

    @GET
    @Counted(name = "performedAdmin", displayName="Performed Admin calls", description = "How many admin calls have been performed.")
    @Timed(name = "adminTimer", absolute = true, description = "A measure of how long it takes to perform the admin call.", unit = MetricUnits.MILLISECONDS)
    @Metered(name = "adminFrequency", absolute = true)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("admin")
    public Message getAdmin() {
        randomDelay(1,2);
        return new Message("admin");
    }

}
